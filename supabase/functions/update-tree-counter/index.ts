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

    // Initialize Supabase client with service role for write access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current stats
    const { data: currentStats, error: fetchError } = await supabase
      .from("tree_counter")
      .select("*")
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    // If no row exists, insert one
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
      // Update existing row
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

    console.log(`Tree counter updated by wallet ${walletAddress}: +${treesPlanted.toFixed(2)} trees, +$${donationUsd.toFixed(2)}, txHash: ${txHash}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        treesPlanted,
        donationUsd,
        walletAddress,
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
