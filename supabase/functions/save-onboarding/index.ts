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
    const { dynamicUserId, firstName, lastName, pseudo, dateOfBirth, avatarUrl, walletAddress, password } = await req.json();

    if (!dynamicUserId || !firstName?.trim() || !pseudo?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pseudoClean = pseudo.trim();
    if (pseudoClean.length < 3 || pseudoClean.length > 20) {
      return new Response(
        JSON.stringify({ error: "Pseudo must be 3-20 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(pseudoClean)) {
      return new Response(
        JSON.stringify({ error: "Pseudo contains invalid characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Simple password hash (SHA-256)
    let pinHash: string | null = null;
    if (password && password.length >= 6) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + dynamicUserId); // salt with userId
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      pinHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check pseudo uniqueness (excluding current user)
    const { data: existing } = await supabase
      .from("user_profiles")
      .select("id, dynamic_user_id")
      .eq("pseudo", pseudoClean)
      .maybeSingle();

    if (existing && existing.dynamic_user_id !== dynamicUserId) {
      return new Response(
        JSON.stringify({ error: "This pseudo is already taken" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upsert profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .upsert(
        {
          dynamic_user_id: dynamicUserId,
          first_name: firstName.trim(),
          last_name: lastName?.trim() || null,
          pseudo: pseudoClean,
          date_of_birth: dateOfBirth || null,
          avatar_url: avatarUrl || null,
          pin_hash: pinHash,
          onboarding_completed: true,
        },
        { onConflict: "dynamic_user_id" }
      )
      .select()
      .single();

    if (profileError) {
      console.error("Error saving profile:", profileError);
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save wallet if provided
    if (walletAddress && profile) {
      const { error: walletError } = await supabase
        .from("user_wallets")
        .upsert(
          {
            profile_id: profile.id,
            wallet_address: walletAddress,
            wallet_name: "ReforestWallet",
            wallet_type: "mpc",
            chain: "ethereum",
            is_primary: true,
          },
          { onConflict: "wallet_address" }
        );

      if (walletError) {
        console.error("Error saving wallet:", walletError);
      }

      // Also upsert wallet_stats
      await supabase
        .from("wallet_stats")
        .upsert(
          {
            wallet_address: walletAddress,
            display_name: pseudoClean,
            avatar_url: avatarUrl || null,
          },
          { onConflict: "wallet_address" }
        );
    }

    return new Response(
      JSON.stringify({ success: true, profile }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Onboarding error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
