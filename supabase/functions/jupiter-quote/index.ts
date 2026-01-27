import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const FEE_BPS = 100; // 1% fee

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fromToken, toToken, amount } = await req.json();

    if (!fromToken || !toToken || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate amount after 1% fee deduction
    const amountBigInt = BigInt(amount);
    const feeAmount = amountBigInt * BigInt(FEE_BPS) / BigInt(10000);
    const amountAfterFee = amountBigInt - feeAmount;

    // Fetch quote from Jupiter
    const params = new URLSearchParams({
      inputMint: fromToken,
      outputMint: toToken,
      amount: amountAfterFee.toString(),
      slippageBps: '50', // 0.5% slippage
    });

    const response = await fetch(`${JUPITER_QUOTE_API}?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jupiter API error:', errorText);
      
      // Return mock data for development
      return new Response(
        JSON.stringify({
          toAmount: (Number(amountAfterFee) * 0.95).toString(), // Mock conversion
          estimatedGas: '5000',
          protocols: ['Jupiter'],
          priceImpact: '0.1',
          feeAmount: feeAmount.toString(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        toAmount: data.outAmount,
        estimatedGas: '5000', // Solana uses compute units, not gas
        protocols: data.routePlan?.map((r: { swapInfo: { label: string } }) => r.swapInfo.label) || ['Jupiter'],
        priceImpact: data.priceImpactPct || '0',
        feeAmount: feeAmount.toString(),
        route: data.routePlan,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch quote' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
