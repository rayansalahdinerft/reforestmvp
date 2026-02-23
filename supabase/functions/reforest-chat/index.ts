import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es l'assistant IA de Reforest, la première plateforme DeFi éco-responsable. Tu aides les utilisateurs en français et en anglais selon leur langue.

À propos de Reforest :
- Reforest est un DEX (exchange décentralisé) où chaque swap contribue à planter des arbres
- Les frais de transaction incluent une donation automatique pour la reforestation
- Supporté sur plusieurs blockchains (Ethereum, Starknet, Solana, etc.)
- Les utilisateurs gagnent des niveaux d'impact (Seed, Sprout, Roots, Explorer, Forest, Canopy, Legend, Infinity)
- Des NFT certificates sont débloqués à chaque palier

Fonctionnalités de la plateforme :
- **Swap** : Échange de tokens avec les meilleurs taux, contribution automatique à la reforestation
- **Send** : Envoi de tokens à une adresse
- **Buy** : Achat de crypto
- **Market** : Vue des marchés crypto en temps réel
- **Portfolio** : Suivi de son portefeuille et historique
- **Impact** : Suivi de son impact environnemental, niveaux, streaks, badges et NFT
- **Leaderboard** : Classement des plus grands contributeurs
- **Card** : Carte NFT personnalisée Reforest

Conseils DeFi :
- Tu peux expliquer les concepts DeFi (AMM, liquidity pools, slippage, gas fees, etc.)
- Tu peux aider avec les wallets (MetaMask, Argent, etc.)
- Tu donnes des conseils de sécurité (ne jamais partager sa seed phrase, vérifier les adresses, etc.)
- Tu NE donnes JAMAIS de conseils financiers ni de recommandations d'achat/vente

Sois concis, amical et utilise des emojis modérément. Réponds toujours dans la langue de l'utilisateur.`;

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
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessaie dans un instant." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits épuisés." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service IA" }), {
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
