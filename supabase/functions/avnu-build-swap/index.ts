const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// AVNU API for Starknet swaps
const AVNU_API_URL = 'https://starknet.api.avnu.fi';

interface BuildSwapRequest {
  quoteId: string;
  slippage?: number;
  takerAddress: string;
  includeApprove?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: BuildSwapRequest = await req.json();
    
    const { quoteId, slippage = 1, takerAddress, includeApprove = true } = body;

    if (!quoteId || !takerAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: quoteId, takerAddress' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Building AVNU swap for quote: ${quoteId}, taker: ${takerAddress}`);

    // Build the swap calldata via AVNU
    const response = await fetch(`${AVNU_API_URL}/swap/v2/build`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId,
        takerAddress,
        slippage: slippage / 100, // AVNU expects decimal (0.01 = 1%)
        includeApprove,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AVNU build error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `AVNU API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const buildResult = await response.json();

    console.log('AVNU build result:', JSON.stringify(buildResult).slice(0, 500));

    // The AVNU API returns the calldata needed for the swap
    return new Response(
      JSON.stringify({
        success: true,
        contractAddress: buildResult.contractAddress,
        entrypoint: buildResult.entrypoint || 'multi_route_swap',
        calldata: buildResult.calldata,
        approveCall: buildResult.approveData ? {
          contractAddress: buildResult.approveData.contractAddress,
          calldata: buildResult.approveData.calldata,
        } : null,
        gasEstimate: buildResult.gasEstimate,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in avnu-build-swap function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to build swap',
        success: false,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
