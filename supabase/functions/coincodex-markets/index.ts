import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory cache with 2-minute TTL
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 2 * 60 * 1000;

// CoinCodex symbol mapping (they use their own internal IDs)
const SYMBOL_MAP: Record<string, string> = {
  'btc': 'BTC',
  'eth': 'ETH',
  'bnb': 'BNB',
  'sol': 'SOL',
  'matic': 'MATIC',
  'pol': 'MATIC',
  'arb': 'ARB',
  'op': 'OP',
  'avax': 'AVAX',
  'strk': 'STRK',
  'uni': 'UNI',
  'aave': 'AAVE',
  'link': 'LINK',
  'crv': 'CRV',
  'usdc': 'USDC',
  'usdt': 'USDT',
  'dai': 'DAI',
  'doge': 'DOGE',
  'shib': 'SHIB',
  'pepe': 'PEPE',
  'bonk': 'BONK',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols } = await req.json();

    if (!symbols || !Array.isArray(symbols)) {
      return new Response(
        JSON.stringify({ error: "Missing symbols parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cacheKey = `markets-${symbols.sort().join(',')}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}`);
      return new Response(
        JSON.stringify({ data: cached.data, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching from CoinCodex for symbols: ${symbols.join(',')}`);

    // Fetch data for each symbol
    const results = await Promise.all(
      symbols.map(async (symbol: string) => {
        const coincodexSymbol = SYMBOL_MAP[symbol.toLowerCase()] || symbol.toUpperCase();
        try {
          const response = await fetch(
            `https://coincodex.com/api/coincodex/get_coin/${coincodexSymbol}`,
            {
              headers: {
                "Accept": "application/json",
                "User-Agent": "Reforest-DEX/1.0",
              },
            }
          );

          if (!response.ok) {
            console.error(`CoinCodex API error for ${coincodexSymbol}: ${response.status}`);
            return null;
          }

          const data = await response.json();
          return {
            symbol: symbol.toLowerCase(),
            coincodexSymbol,
            data,
          };
        } catch (err) {
          console.error(`Error fetching ${coincodexSymbol}:`, err);
          return null;
        }
      })
    );

    const validResults = results.filter(r => r !== null);

    // Transform to our format
    const tokens = validResults.map((result) => {
      const d = result.data;
      console.log(`Token ${result.coincodexSymbol} data keys:`, Object.keys(d).slice(0, 20));
      return {
        id: result.coincodexSymbol.toLowerCase(),
        symbol: d.symbol || result.symbol,
        name: d.name || d.display_name || result.coincodexSymbol,
        image: d.image_url || `https://coincodex.com/images/coins/${result.coincodexSymbol.toLowerCase()}.png`,
        current_price: parseFloat(d.last_price_usd) || 0,
        price_change_percentage_24h: parseFloat(d.price_change_1D_percent) || parseFloat(d.change_24h) || 0,
        market_cap: parseFloat(d.market_cap_usd) || 0,
        total_volume: parseFloat(d.volume_24_usd) || parseFloat(d.volume_24h_usd) || 0,
        high_24h: parseFloat(d.high_24_usd) || parseFloat(d.price_high_24_usd) || 0,
        low_24h: parseFloat(d.low_24_usd) || parseFloat(d.price_low_24_usd) || 0,
      };
    });

    // Cache the result
    cache.set(cacheKey, { data: tokens, timestamp: Date.now() });

    return new Response(
      JSON.stringify({ data: tokens, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in coincodex-markets:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
