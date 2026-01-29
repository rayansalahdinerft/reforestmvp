const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Ekubo API for Starknet swaps
const EKUBO_API_URL = 'https://prod-api.ekubo.org';

// Ekubo Router contract on Starknet mainnet
const EKUBO_ROUTER_ADDRESS = '0x0199741822c2dc722f6f605204f35e56dbc23bceed54818168571b275542ee42';

interface QuoteRequest {
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: string;
  takerAddress?: string;
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

    // Normalize addresses (ensure they have 0x prefix and proper format)
    const normalizeAddress = (addr: string) => {
      if (!addr.startsWith('0x')) {
        return '0x' + addr;
      }
      return addr.toLowerCase();
    };

    const tokenIn = normalizeAddress(sellTokenAddress);
    const tokenOut = normalizeAddress(buyTokenAddress);
    const amount = sellAmount;

    console.log(`Fetching Ekubo quote: ${tokenIn} -> ${tokenOut}, amount: ${amount}`);

    // Ekubo quote endpoint
    // The API expects token addresses and amount in URL path
    const quoteUrl = `${EKUBO_API_URL}/quote/${amount}/${tokenIn}/${tokenOut}`;
    
    console.log('Ekubo quote URL:', quoteUrl);

    const response = await fetch(quoteUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ekubo API error:', response.status, errorText);
      
      // Try alternative route endpoint if quote fails
      const routeUrl = `${EKUBO_API_URL}/route/${tokenIn}/${tokenOut}/${amount}`;
      console.log('Trying Ekubo route URL:', routeUrl);
      
      const routeResponse = await fetch(routeUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!routeResponse.ok) {
        const routeError = await routeResponse.text();
        console.error('Ekubo route API error:', routeResponse.status, routeError);
        return new Response(
          JSON.stringify({ 
            error: `Ekubo API error: ${response.status}`, 
            details: errorText,
            success: false 
          }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const routeData = await routeResponse.json();
      
      return new Response(
        JSON.stringify({
          success: true,
          sellTokenAddress: tokenIn,
          buyTokenAddress: tokenOut,
          sellAmount: amount,
          buyAmount: routeData.specifiedAmount || routeData.amount || '0',
          toAmount: routeData.specifiedAmount || routeData.amount || '0',
          route: routeData.route || routeData,
          routerAddress: EKUBO_ROUTER_ADDRESS,
          source: 'ekubo',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const quoteData = await response.json();

    console.log('Ekubo quote response:', JSON.stringify(quoteData).slice(0, 500));

    // Parse the quote response
    // Ekubo returns the expected output amount and route info
    const buyAmount = quoteData.specifiedAmount || quoteData.total || quoteData.amount || '0';

    return new Response(
      JSON.stringify({
        success: true,
        sellTokenAddress: tokenIn,
        buyTokenAddress: tokenOut,
        sellAmount: amount,
        buyAmount: buyAmount,
        toAmount: buyAmount,
        route: quoteData.route || quoteData.splits || quoteData,
        routerAddress: EKUBO_ROUTER_ADDRESS,
        priceImpact: quoteData.priceImpact,
        estimatedGas: quoteData.gasEstimate || '0',
        source: 'ekubo',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ekubo-quote function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch quote',
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
