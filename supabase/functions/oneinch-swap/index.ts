const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ONEINCH_API_URL = 'https://api.1inch.dev/swap/v6.0';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { chainId, fromToken, toToken, amount, fromAddress, slippage } = await req.json();

    if (!chainId || !fromToken || !toToken || !amount || !fromAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: chainId, fromToken, toToken, amount, fromAddress' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('ONEINCH_API_KEY');
    
    if (!apiKey) {
      console.log('ONEINCH_API_KEY not configured - returning demo mode response');
      // Return mock data for demo if no API key
      return new Response(
        JSON.stringify({
          success: false,
          error: 'API_KEY_NOT_CONFIGURED',
          message: '1inch API key not configured. Please add ONEINCH_API_KEY secret.',
          demo: true,
          toAmount: (parseFloat(amount) * 0.99).toString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call 1inch Swap API to get transaction data
    const swapUrl = new URL(`${ONEINCH_API_URL}/${chainId}/swap`);
    swapUrl.searchParams.set('src', fromToken);
    swapUrl.searchParams.set('dst', toToken);
    swapUrl.searchParams.set('amount', amount);
    swapUrl.searchParams.set('from', fromAddress);
    swapUrl.searchParams.set('slippage', (slippage || 1).toString());
    swapUrl.searchParams.set('disableEstimate', 'true'); // We'll execute through our contract

    console.log('Calling 1inch swap API:', swapUrl.toString());

    const response = await fetch(swapUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('1inch API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `1inch API error: ${response.status}`,
          details: errorText 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        tx: {
          to: data.tx?.to,
          data: data.tx?.data,
          value: data.tx?.value || '0',
          gas: data.tx?.gas,
        },
        toAmount: data.toAmount || data.dstAmount,
        estimatedGas: data.tx?.gas || data.estimatedGas,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in oneinch-swap:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
