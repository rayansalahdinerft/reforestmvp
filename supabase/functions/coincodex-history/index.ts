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
const CACHE_TTL = 5 * 60 * 1000;

// CoinCodex symbol mapping
const SYMBOL_MAP: Record<string, string> = {
  'btc': 'BTC',
  'bitcoin': 'BTC',
  'eth': 'ETH',
  'ethereum': 'ETH',
  'bnb': 'BNB',
  'binancecoin': 'BNB',
  'sol': 'SOL',
  'solana': 'SOL',
  'matic': 'MATIC',
  'matic-network': 'MATIC',
  'pol': 'MATIC',
  'arb': 'ARB',
  'arbitrum': 'ARB',
  'op': 'OP',
  'optimism': 'OP',
  'avax': 'AVAX',
  'avalanche-2': 'AVAX',
  'strk': 'STRK',
  'starknet': 'STRK',
  'uni': 'UNI',
  'uniswap': 'UNI',
  'aave': 'AAVE',
  'link': 'LINK',
  'chainlink': 'LINK',
  'crv': 'CRV',
  'curve-dao-token': 'CRV',
  'usdc': 'USDC',
  'usd-coin': 'USDC',
  'usdt': 'USDT',
  'tether': 'USDT',
  'dai': 'DAI',
  'doge': 'DOGE',
  'dogecoin': 'DOGE',
  'shib': 'SHIB',
  'shiba-inu': 'SHIB',
  'pepe': 'PEPE',
  'bonk': 'BONK',
};

// Calculate date range based on days
const getDateRange = (days: string): { startDate: string; endDate: string; samples: number } => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  
  let daysNum = parseInt(days, 10);
  if (days === 'max' || isNaN(daysNum)) {
    daysNum = 365 * 5; // 5 years for "ALL"
  }
  
  const startDate = new Date(now.getTime() - daysNum * 24 * 60 * 60 * 1000);
  
  // Adjust samples based on timeframe
  let samples = 100;
  if (daysNum <= 1) samples = 24;
  else if (daysNum <= 7) samples = 50;
  else if (daysNum <= 30) samples = 60;
  else if (daysNum <= 365) samples = 100;
  else samples = 150;
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate,
    samples,
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { coinId, days } = await req.json();

    if (!coinId || !days) {
      return new Response(
        JSON.stringify({ error: "Missing coinId or days parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map to CoinCodex symbol
    const coincodexSymbol = SYMBOL_MAP[coinId.toLowerCase()] || coinId.toUpperCase();
    const cacheKey = `${coincodexSymbol}-${days}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}`);
      return new Response(
        JSON.stringify({ prices: cached.data.prices, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { startDate, endDate, samples } = getDateRange(days);
    console.log(`Fetching from CoinCodex: ${coincodexSymbol}, ${startDate} to ${endDate}, samples=${samples}`);

    const response = await fetch(
      `https://coincodex.com/api/coincodex/get_coin_history/${coincodexSymbol}/${startDate}/${endDate}/${samples}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Reforest-DEX/1.0",
        },
      }
    );

    if (!response.ok) {
      console.error(`CoinCodex API error: ${response.status}`);
      
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

    // CoinCodex returns: { [symbol]: [[timestamp, price, volume], ...] }
    // We need to transform to: { prices: [[timestamp, price], ...] }
    let prices: number[][] = [];
    
    // The response structure varies - handle both cases
    if (Array.isArray(data)) {
      // Direct array format
      prices = data.map((item: number[]) => [item[0] * 1000, item[1]]); // Convert to ms
    } else if (data[coincodexSymbol]) {
      // Object with symbol key
      prices = data[coincodexSymbol].map((item: number[]) => [item[0] * 1000, item[1]]);
    } else {
      // Try to find the data in any key
      const keys = Object.keys(data);
      if (keys.length > 0 && Array.isArray(data[keys[0]])) {
        prices = data[keys[0]].map((item: number[]) => [item[0] * 1000, item[1]]);
      }
    }

    // Cache the result
    cache.set(cacheKey, { data: { prices }, timestamp: Date.now() });

    // Clean old cache entries
    for (const [key, value] of cache.entries()) {
      if (Date.now() - value.timestamp > CACHE_TTL * 10) {
        cache.delete(key);
      }
    }

    return new Response(
      JSON.stringify({ prices, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in coincodex-history:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
