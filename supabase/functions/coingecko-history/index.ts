import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CacheEntry {
  data: { prices: number[][] };
  timestamp: number;
}

// In-memory cache with 5-minute TTL
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Free CoinGecko API limits - 'max' is limited to last year for free tier
const sanitizeDays = (days: string): string => {
  // Free tier supports: 1, 7, 30, 90, 180, 365
  // 'max' often returns 401 on free tier, so cap at 365
  if (days === 'max') return '365';
  const numDays = parseInt(days, 10);
  if (isNaN(numDays) || numDays > 365) return '365';
  return days;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { coinId, days: rawDays } = await req.json();

    if (!coinId || !rawDays) {
      return new Response(
        JSON.stringify({ error: "Missing coinId or days parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const days = sanitizeDays(rawDays);
    const cacheKey = `${coinId}-${days}`;
    const cached = cache.get(cacheKey);

    // Return cached data if valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}`);
      return new Response(
        JSON.stringify({ prices: cached.data.prices, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching from CoinGecko: ${coinId}, days=${days}`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Reforest-DEX/1.0",
        },
      }
    );

    if (!response.ok) {
      console.error(`CoinGecko API error: ${response.status}`);
      
      // Return cached data even if expired
      if (cached) {
        console.log(`Returning stale cache for ${cacheKey}`);
        return new Response(
          JSON.stringify({ prices: cached.data.prices, cached: true, stale: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache the result
    cache.set(cacheKey, { data: { prices: data.prices }, timestamp: Date.now() });

    // Clean old cache entries
    for (const [key, value] of cache.entries()) {
      if (Date.now() - value.timestamp > CACHE_TTL * 10) {
        cache.delete(key);
      }
    }

    return new Response(
      JSON.stringify({ prices: data.prices, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in coingecko-history:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
