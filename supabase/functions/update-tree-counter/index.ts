import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { donationUsd, txHash, walletAddress } = await req.json();

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

    const treesPlanted = donationUsd / 2.5;
    const normalizedAddress = walletAddress.toLowerCase();

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

    // Update per-wallet stats + streak
    const { data: walletStats, error: walletFetchError } = await supabase
      .from("wallet_stats")
      .select("*")
      .eq("wallet_address", normalizedAddress)
      .maybeSingle();

    if (walletFetchError) {
      console.error("Error fetching wallet stats:", walletFetchError);
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (!walletStats) {
      const { error: walletInsertError } = await supabase
        .from("wallet_stats")
        .insert({
          wallet_address: normalizedAddress,
          total_trees: treesPlanted,
          total_donations_usd: donationUsd,
          total_swaps: 1,
          current_streak: 1,
          longest_streak: 1,
          last_swap_date: today,
        });
      if (walletInsertError) {
        console.error("Error inserting wallet stats:", walletInsertError);
      }

      // Award first_swap badge
      await supabase.from("badges").upsert({
        wallet_address: normalizedAddress,
        badge_type: "first_swap",
        badge_name: "First Swap",
        badge_description: "Completed your first swap",
      }, { onConflict: "wallet_address,badge_type" });
    } else {
      // Calculate streak
      const lastSwapDate = walletStats.last_swap_date;
      let newStreak = walletStats.current_streak || 0;

      if (lastSwapDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastSwapDate === yesterdayStr) {
          newStreak += 1;
        } else if (lastSwapDate !== today) {
          newStreak = 1; // Reset streak
        }
      }

      const newLongest = Math.max(walletStats.longest_streak || 0, newStreak);
      const newTotalSwaps = walletStats.total_swaps + 1;

      const { error: walletUpdateError } = await supabase
        .from("wallet_stats")
        .update({
          total_trees: parseFloat(walletStats.total_trees) + treesPlanted,
          total_donations_usd: parseFloat(walletStats.total_donations_usd) + donationUsd,
          total_swaps: newTotalSwaps,
          current_streak: newStreak,
          longest_streak: newLongest,
          last_swap_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq("id", walletStats.id);

      if (walletUpdateError) {
        console.error("Error updating wallet stats:", walletUpdateError);
      }

      // Award badges based on milestones
      const badgesToAward: { type: string; name: string; desc: string }[] = [];

      if (newTotalSwaps >= 10) badgesToAward.push({ type: "swaps_10", name: "10 Swaps", desc: "Completed 10 swaps" });
      if (newTotalSwaps >= 100) badgesToAward.push({ type: "swaps_100", name: "100 Swaps", desc: "Completed 100 swaps" });
      if (newStreak >= 7) badgesToAward.push({ type: "streak_7", name: "7-Day Streak", desc: "Swapped 7 days in a row" });
      if (newStreak >= 30) badgesToAward.push({ type: "streak_30", name: "30-Day Streak", desc: "Swapped 30 days in a row" });
      if (newStreak >= 100) badgesToAward.push({ type: "streak_100", name: "100-Day Streak", desc: "Swapped 100 days in a row" });

      for (const badge of badgesToAward) {
        await supabase.from("badges").upsert({
          wallet_address: normalizedAddress,
          badge_type: badge.type,
          badge_name: badge.name,
          badge_description: badge.desc,
        }, { onConflict: "wallet_address,badge_type" });
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
