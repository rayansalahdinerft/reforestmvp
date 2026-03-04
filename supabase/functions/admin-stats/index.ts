import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const { dynamicUserId } = await req.json().catch(() => ({}))

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Check admin access
    if (!dynamicUserId) {
      return new Response(JSON.stringify({ error: 'Missing dynamicUserId' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: isAdmin } = await supabaseAdmin.rpc('is_admin_by_dynamic_id', {
      _dynamic_user_id: dynamicUserId
    })

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch all stats in parallel
    const [
      profilesRes,
      walletsRes,
      swapHistoryRes,
      treeCounterRes,
      walletStatsRes,
      badgesRes,
      securityEventsRes,
      recentProfilesRes,
    ] = await Promise.all([
      supabaseAdmin.from('user_profiles').select('id, pseudo, email, first_name, last_name, created_at, onboarding_completed, avatar_url, dynamic_user_id'),
      supabaseAdmin.from('user_wallets').select('id, wallet_address, wallet_type, chain, created_at, profile_id, is_primary, import_method'),
      supabaseAdmin.from('swap_history').select('*').order('created_at', { ascending: false }).limit(500),
      supabaseAdmin.from('tree_counter').select('*').limit(1).maybeSingle(),
      supabaseAdmin.from('wallet_stats').select('*').order('total_trees', { ascending: false }),
      supabaseAdmin.from('badges').select('*'),
      supabaseAdmin.from('security_events').select('*').order('created_at', { ascending: false }).limit(200),
      supabaseAdmin.from('user_profiles').select('id, pseudo, first_name, email, created_at').order('created_at', { ascending: false }).limit(20),
    ])

    const profiles = profilesRes.data || []
    const wallets = walletsRes.data || []
    const swaps = swapHistoryRes.data || []
    const treeCounter = treeCounterRes.data
    const walletStats = walletStatsRes.data || []
    const badges = badgesRes.data || []
    const securityEvents = securityEventsRes.data || []
    const recentProfiles = recentProfilesRes.data || []

    // Calculate metrics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const registrationsToday = profiles.filter(p => new Date(p.created_at) >= today).length
    const registrationsWeek = profiles.filter(p => new Date(p.created_at) >= weekAgo).length
    const registrationsMonth = profiles.filter(p => new Date(p.created_at) >= monthAgo).length

    const swapsToday = swaps.filter(s => new Date(s.created_at) >= today).length
    const swapsWeek = swaps.filter(s => new Date(s.created_at) >= weekAgo).length
    const swapsMonth = swaps.filter(s => new Date(s.created_at) >= monthAgo).length

    // Daily registration trend (last 30 days)
    const dailyRegistrations: Record<string, number> = {}
    const dailySwaps: Record<string, number> = {}
    for (let i = 0; i < 30; i++) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().split('T')[0]
      dailyRegistrations[key] = 0
      dailySwaps[key] = 0
    }
    profiles.forEach(p => {
      const key = new Date(p.created_at).toISOString().split('T')[0]
      if (dailyRegistrations[key] !== undefined) dailyRegistrations[key]++
    })
    swaps.forEach(s => {
      const key = new Date(s.created_at).toISOString().split('T')[0]
      if (dailySwaps[key] !== undefined) dailySwaps[key]++
    })

    // Swap type breakdown
    const swapsByType: Record<string, number> = {}
    swaps.forEach(s => {
      const type = s.tx_type || 'swap'
      swapsByType[type] = (swapsByType[type] || 0) + 1
    })

    // Top tokens
    const tokenCounts: Record<string, number> = {}
    swaps.forEach(s => {
      tokenCounts[s.sell_token] = (tokenCounts[s.sell_token] || 0) + 1
      tokenCounts[s.buy_token] = (tokenCounts[s.buy_token] || 0) + 1
    })
    const topTokens = Object.entries(tokenCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([token, count]) => ({ token, count }))

    // Active users (users with at least 1 swap)
    const activeWallets = new Set(swaps.map(s => s.wallet_address.toLowerCase()))

    // Activation funnel
    const totalSignups = profiles.length
    const withWallet = new Set(wallets.map(w => w.profile_id)).size
    const withSwap = activeWallets.size
    const onboardingCompleted = profiles.filter(p => p.onboarding_completed).length

    const totalDonations = swaps.reduce((sum, s) => sum + Number(s.donation_usd || 0), 0)
    const totalTrees = swaps.reduce((sum, s) => sum + Number(s.trees_planted || 0), 0)

    const response = {
      overview: {
        totalUsers: profiles.length,
        registrationsToday,
        registrationsWeek,
        registrationsMonth,
        activeUsers: activeWallets.size,
        totalSwaps: swaps.length,
        swapsToday,
        swapsWeek,
        swapsMonth,
        totalDonationsUsd: totalDonations,
        totalTreesPlanted: totalTrees,
        totalWallets: wallets.length,
        totalBadges: badges.length,
      },
      funnel: {
        totalSignups,
        onboardingCompleted,
        withWallet,
        withSwap,
      },
      trends: {
        dailyRegistrations: Object.entries(dailyRegistrations)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, count]) => ({ date, count })),
        dailySwaps: Object.entries(dailySwaps)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, count]) => ({ date, count })),
      },
      swapsByType,
      topTokens,
      recentProfiles,
      leaderboard: walletStats.slice(0, 20),
      securityEvents: securityEvents.slice(0, 50),
      treeCounter,
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
