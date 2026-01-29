const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// AVNU API for Starknet swaps (aggregates Ekubo, JediSwap, etc.)
const AVNU_API_URL = 'https://starknet.api.avnu.fi';

interface QuoteRequest {
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: string;
  takerAddress?: string;
}

interface QuoteResponse {
  quoteId: string;
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: string;
  buyAmount: string;
  routes: Array<{
    name: string;
    percent: number;
  }>;
  priceRatioUsd?: number;
  gasEstimate?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: QuoteRequest = await req.json();
    
    const { sellTokenAddress, buyTokenAddress, sellAmount, takerAddress } = body;

    if (!sellTokenAddress || !buyTokenAddress || !sellAmount) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: sellTokenAddress, buyTokenAddress, sellAmount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query params for AVNU
    const params = new URLSearchParams({
      sellTokenAddress,
      buyTokenAddress,
      sellAmount,
      ...(takerAddress && { takerAddress }),
    });

    console.log(`Fetching AVNU quote: ${sellTokenAddress} -> ${buyTokenAddress}, amount: ${sellAmount}`);

    const response = await fetch(`${AVNU_API_URL}/swap/v2/quotes?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AVNU API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AVNU API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const quotes: QuoteResponse[] = await response.json();

    if (!quotes || quotes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No quotes available for this pair' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the best quote (first one)
    const bestQuote = quotes[0];

    return new Response(
      JSON.stringify({
        success: true,
        quoteId: bestQuote.quoteId,
        sellTokenAddress: bestQuote.sellTokenAddress,
        buyTokenAddress: bestQuote.buyTokenAddress,
        sellAmount: bestQuote.sellAmount,
        buyAmount: bestQuote.buyAmount,
        toAmount: bestQuote.buyAmount, // Alias for compatibility with existing code
        routes: bestQuote.routes,
        protocols: bestQuote.routes.map(r => r.name),
        estimatedGas: bestQuote.gasEstimate || '0',
        priceRatioUsd: bestQuote.priceRatioUsd,
        source: 'avnu',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in avnu-quote function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch quote',
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
