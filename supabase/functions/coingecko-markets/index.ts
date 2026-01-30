import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory cache with 60s TTL (protects CoinGecko + keeps UI responsive)
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify({ data: cached.data, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      // Return stale cache if we have one
      if (cached) {
        return new Response(JSON.stringify({ data: cached.data, cached: true, stale: true }), {
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

    cache.set(cacheKey, { data, timestamp: Date.now() });
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
