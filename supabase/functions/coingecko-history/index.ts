import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CacheEntry {
  data: { prices: number[][] };
  timestamp: number;
}

// In-memory cache with 5-minute TTL
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

// Symbol to CoinGecko ID mapping
const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  MATIC: "matic-network",
  POL: "matic-network",
  ARB: "arbitrum",
  OP: "optimism",
  AVAX: "avalanche-2",
  STRK: "starknet",
  UNI: "uniswap",
  AAVE: "aave",
  LINK: "chainlink",
  CRV: "curve-dao-token",
  USDC: "usd-coin",
  USDT: "tether",
  DAI: "dai",
  DOGE: "dogecoin",
  SHIB: "shiba-inu",
  PEPE: "pepe",
  BONK: "bonk",
};

// Free CoinGecko API limits - 'max' is limited to last year for free tier
const sanitizeDays = (days: string): string => {
  if (days === "max") return "365";
  const numDays = parseInt(days, 10);
  if (isNaN(numDays) || numDays > 365) return "365";
  return days;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { coinId, days: rawDays } = await req.json();

    if (!coinId || !rawDays) {
      return new Response(
        JSON.stringify({ error: "Missing coinId or days parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map symbol to CoinGecko ID if needed
    const geckoId = SYMBOL_TO_ID[coinId.toUpperCase()] || coinId.toLowerCase();
    const days = sanitizeDays(rawDays);
    const cacheKey = `${geckoId}-${days}`;
    const cached = cache.get(cacheKey);

    // Return cached data if valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}`);
      return new Response(
        JSON.stringify({ prices: cached.data.prices, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching from CoinGecko: ${geckoId}, days=${days}`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          Accept: "application/json",
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
