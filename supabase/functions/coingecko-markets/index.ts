import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  // Important: must include all headers the browser sends, otherwise the preflight fails
  // and the client sees "Failed to fetch".
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory cache with 2-minute TTL (protects CoinGecko rate limits)
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes
const STALE_TTL = 10 * 60 * 1000; // 10 minutes for stale-while-revalidate

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(JSON.stringify({ error: "Missing ids parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedIds = ids
      .map((x: unknown) => (typeof x === "string" ? x.trim() : ""))
      .filter(Boolean);

    if (normalizedIds.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid ids" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cacheKey = `coingecko-markets-${normalizedIds.slice().sort().join(",")}`;
    const cached = cache.get(cacheKey);
    const now = Date.now();

    // Return fresh cache if available
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify({ data: cached.data, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return stale cache while we try to refresh (stale-while-revalidate pattern)
    const hasStaleCache = cached && now - cached.timestamp < STALE_TTL;

    const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("ids", normalizedIds.join(","));
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", "250");
    url.searchParams.set("page", "1");
    url.searchParams.set("sparkline", "true");
    url.searchParams.set("price_change_percentage", "24h");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "Reforest-DEX/1.0",
      },
    });

    if (!response.ok) {
      console.warn(`CoinGecko API error: ${response.status}`);
      
      // Return stale cache if we have one (for any error including 429)
      if (hasStaleCache) {
        console.log("Returning stale cache due to API error");
        return new Response(JSON.stringify({ data: cached!.data, cached: true, stale: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const text = await response.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: `CoinGecko API error: ${response.status}`, details: text.slice(0, 500) }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();

    cache.set(cacheKey, { data, timestamp: now });
    return new Response(JSON.stringify({ data, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in coingecko-markets:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
