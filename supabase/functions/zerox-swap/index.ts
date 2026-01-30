import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Fee recipient address (1% fee for reforestation)
const FEE_RECIPIENT = '0x09a7d589709A4487e5C0cB3c74dEc41f8B219a0F'
const FEE_BPS = '100' // 1% = 100 basis points

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      chainId, 
      fromToken, 
      toToken, 
      amount, 
      userAddress,
      slippageBps = 100 // Default 1% slippage
    } = await req.json()

    if (!chainId || !fromToken || !toToken || !amount || !userAddress) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('ZEROX_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'API_KEY_NOT_CONFIGURED' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use 0x API v2 with integrated fee collection
    const params = new URLSearchParams({
      chainId: chainId.toString(),
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amount,
      taker: userAddress,
      slippageBps: slippageBps.toString(),
      swapFeeRecipient: FEE_RECIPIENT,
      swapFeeBps: FEE_BPS,
      swapFeeToken: fromToken, // Take 1% fee from sell token
    })

    const url = `https://api.0x.org/swap/allowance-holder/quote?${params.toString()}`
    console.log('Fetching 0x v2 quote:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        '0x-api-key': apiKey,
        '0x-version': 'v2',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('0x API v2 error:', response.status, errorText)
      return new Response(
        JSON.stringify({ success: false, error: '0x API error: ' + errorText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('0x v2 quote response:', JSON.stringify(data, null, 2))

    // 0x v2 returns a ready-to-execute transaction
    return new Response(
      JSON.stringify({
        success: true,
        // Quote info
        toAmount: data.buyAmount,
        minBuyAmount: data.minBuyAmount,
        estimatedGas: data.transaction?.gas || '0',
        protocols: data.route?.fills?.map((f: any) => f.source) || [],
        priceImpact: '0',
        // Fee info - 0x handles the fee automatically
        fees: data.fees,
        // Transaction data - can be sent directly to the blockchain
        transaction: {
          to: data.transaction?.to,
          data: data.transaction?.data,
          value: data.transaction?.value || '0',
          gas: data.transaction?.gas,
          gasPrice: data.transaction?.gasPrice,
        },
        // Allowance target for ERC20 approvals
        allowanceTarget: data.allowanceTarget,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Swap quote error:', errorMessage)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
