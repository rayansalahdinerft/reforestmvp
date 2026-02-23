import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the Reforest assistant. Reforest is a green DeFi platform where every swap plants trees.

TONE: Talk like a knowledgeable friend, not a corporate bot. Be direct, short, useful. No filler, no "Great question!", no "I'd be happy to help!". Just answer. Use emojis sparingly (1-2 max per message). Keep answers under 3-4 sentences unless the user asks for detail.

LANGUAGE: Always reply in the same language the user writes in. If they write in French, reply in French. If in English, reply in English. Etc.

WHAT YOU KNOW:
- Reforest is a DEX where transaction fees fund reforestation automatically
- Supported chains: Ethereum, Starknet, Solana, and more
- Impact levels: Seed → Sprout → Roots → Explorer → Forest → Canopy → Legend → Infinity
- NFT certificates unlock at each level
- Features: Swap, Send, Buy, Market, Portfolio, Impact tracking, Leaderboard, NFT Card
- You can explain DeFi concepts (AMM, slippage, gas, liquidity pools, wallets like MetaMask/Argent)
- You give security tips (never share seed phrase, verify addresses, etc.)

WHAT YOU DON'T DO:
- Never give financial advice or buy/sell recommendations
- Never say "as an AI" or "I'm just an AI"
- Never over-explain obvious things`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests, try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
