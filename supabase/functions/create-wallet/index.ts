import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileId, walletAddress, walletName, chain, walletType } = await req.json();

    if (!profileId || !walletAddress) {
      return new Response(
        JSON.stringify({ error: "Missing profileId or walletAddress" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Count existing wallets for this profile
    const { count } = await supabase
      .from("user_wallets")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId);

    const walletNumber = (count ?? 0) + 1;
    const name = walletName?.trim() || `ReforestWallet ${walletNumber}`;

    // Check if wallet address already exists for this profile
    const { data: existing } = await supabase
      .from("user_wallets")
      .select("id, profile_id")
      .eq("wallet_address", walletAddress)
      .maybeSingle();

    if (existing) {
      // If same profile, just return success (idempotent)
      if (existing.profile_id === profileId) {
        return new Response(
          JSON.stringify({ success: true, wallet: existing }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "This wallet address is already registered to another account" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new wallet
    const { data: wallet, error } = await supabase
      .from("user_wallets")
      .insert({
        profile_id: profileId,
        wallet_address: walletAddress,
        wallet_name: name,
        wallet_type: walletType || "mpc",
        chain: chain || "ethereum",
        is_primary: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating wallet:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also create wallet_stats entry
    await supabase
      .from("wallet_stats")
      .upsert(
        { wallet_address: walletAddress },
        { onConflict: "wallet_address" }
      );

    return new Response(
      JSON.stringify({ success: true, wallet }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Create wallet error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
