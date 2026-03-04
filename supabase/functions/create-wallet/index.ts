import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profileId, walletAddress, walletName, chain, walletType, importMethod } = await req.json();

    if (!profileId || !walletAddress) {
      return new Response(
        JSON.stringify({ error: "Missing profileId or walletAddress" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedAddress = String(walletAddress).toLowerCase().trim();
    if (!ETH_ADDRESS_REGEX.test(normalizedAddress)) {
      return new Response(
        JSON.stringify({ error: "Invalid Ethereum wallet address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedWalletType = walletType === "imported" ? "imported" : "mpc";
    const normalizedImportMethod =
      normalizedWalletType === "imported"
        ? (importMethod === "private_key" ? "private_key" : "address")
        : null;

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

    // Check if wallet address already exists globally
    const { data: existing } = await supabase
      .from("user_wallets")
      .select("id, profile_id")
      .eq("wallet_address", normalizedAddress)
      .maybeSingle();

    if (existing) {
      // If same profile, idempotent success
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
        wallet_address: normalizedAddress,
        wallet_name: name,
        wallet_type: normalizedWalletType,
        chain: chain || "ethereum",
        import_method: normalizedImportMethod,
        is_primary: (count ?? 0) === 0,
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

    await supabase
      .from("wallet_stats")
      .upsert(
        { wallet_address: normalizedAddress },
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
