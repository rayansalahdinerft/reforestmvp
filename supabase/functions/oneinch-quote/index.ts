import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ONEINCH_API_URL = 'https://api.1inch.dev/swap/v6.0';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chainId, fromToken, toToken, amount } = await req.json();

    if (!chainId || !fromToken || !toToken || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('ONEINCH_API_KEY');
    
    if (!apiKey) {
      // Return mock data for demo if no API key
      const mockToAmount = (parseFloat(amount) * 0.95).toString();
      return new Response(
        JSON.stringify({
          toAmount: mockToAmount,
          estimatedGas: '150000',
          protocols: [['1inch Aggregation Router']],
          priceImpact: '0.1',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call 1inch Quote API
    const quoteUrl = `${ONEINCH_API_URL}/${chainId}/quote?src=${fromToken}&dst=${toToken}&amount=${amount}`;
    
    const response = await fetch(quoteUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('1inch API error:', errorText);
      throw new Error(`1inch API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        toAmount: data.toAmount || data.dstAmount,
        estimatedGas: data.gas || data.estimatedGas,
        protocols: data.protocols || [],
        priceImpact: data.priceImpact || '0',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
