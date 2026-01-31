import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donationUsd, txHash, walletAddress } = await req.json();

    // Validate wallet address is provided
    if (!walletAddress || typeof walletAddress !== "string" || !walletAddress.startsWith("0x")) {
      return new Response(
        JSON.stringify({ success: false, error: "Valid wallet address required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!donationUsd || donationUsd <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid donation amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!txHash || typeof txHash !== "string" || !txHash.startsWith("0x")) {
      return new Response(
        JSON.stringify({ success: false, error: "Valid transaction hash required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate trees: $2.50 per tree
    const treesPlanted = donationUsd / 2.5;
    const normalizedAddress = walletAddress.toLowerCase();

    // Initialize Supabase client with service role for write access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update global tree_counter
    const { data: currentStats, error: fetchError } = await supabase
      .from("tree_counter")
      .select("*")
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (!currentStats) {
      const { error: insertError } = await supabase
        .from("tree_counter")
        .insert({
          total_trees: treesPlanted,
          total_donations_usd: donationUsd,
          total_swaps: 1,
        });

      if (insertError) throw insertError;
    } else {
      const { error: updateError } = await supabase
        .from("tree_counter")
        .update({
          total_trees: parseFloat(currentStats.total_trees) + treesPlanted,
          total_donations_usd: parseFloat(currentStats.total_donations_usd) + donationUsd,
          total_swaps: currentStats.total_swaps + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentStats.id);

      if (updateError) throw updateError;
    }

    // Update per-wallet stats
    const { data: walletStats, error: walletFetchError } = await supabase
      .from("wallet_stats")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .maybeSingle();

    if (walletFetchError) {
      console.error("Error fetching wallet stats:", walletFetchError);
    }

    if (!walletStats) {
      // Create new wallet stats entry
      const { error: walletInsertError } = await supabase
        .from("wallet_stats")
        .insert({
          wallet_address: normalizedAddress,
          total_trees: treesPlanted,
          total_donations_usd: donationUsd,
          total_swaps: 1,
        });

      if (walletInsertError) {
        console.error("Error inserting wallet stats:", walletInsertError);
      }
    } else {
      // Update existing wallet stats
      const { error: walletUpdateError } = await supabase
        .from("wallet_stats")
        .update({
          total_trees: parseFloat(walletStats.total_trees) + treesPlanted,
          total_donations_usd: parseFloat(walletStats.total_donations_usd) + donationUsd,
          total_swaps: walletStats.total_swaps + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", walletStats.id);

      if (walletUpdateError) {
        console.error("Error updating wallet stats:", walletUpdateError);
      }
    }

    console.log(`Stats updated for wallet ${normalizedAddress}: +${treesPlanted.toFixed(2)} trees, +$${donationUsd.toFixed(2)}, txHash: ${txHash}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        treesPlanted,
        donationUsd,
        walletAddress: normalizedAddress,
        message: `Added ${treesPlanted.toFixed(2)} trees from $${donationUsd.toFixed(2)} donation`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error updating tree counter:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
