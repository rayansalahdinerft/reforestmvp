import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// 0x API endpoints per chain
const ZEROX_ENDPOINTS: Record<number, string> = {
  1: 'https://api.0x.org',
  137: 'https://polygon.api.0x.org',
  42161: 'https://arbitrum.api.0x.org',
  10: 'https://optimism.api.0x.org',
  8453: 'https://base.api.0x.org',
  43114: 'https://avalanche.api.0x.org',
  56: 'https://bsc.api.0x.org',
}

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
      slippagePercentage = 1 
    } = await req.json()

    if (!chainId || !fromToken || !toToken || !amount || !userAddress) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const baseUrl = ZEROX_ENDPOINTS[chainId]
    if (!baseUrl) {
      return new Response(
        JSON.stringify({ success: false, error: `Chain ${chainId} not supported by 0x` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate 99% of amount (contract takes 1% fee before forwarding)
    const amountBigInt = BigInt(amount)
    const swapAmount = ((amountBigInt * 99n) / 100n).toString()

    // Build 0x swap quote URL - this returns executable calldata
    const params = new URLSearchParams({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: swapAmount, // 99% goes to 0x router
      takerAddress: userAddress, // User receives the output tokens
      slippagePercentage: slippagePercentage.toString(),
    })

    const url = `${baseUrl}/swap/v1/quote?${params.toString()}`
    
    console.log('Fetching 0x swap data:', url)
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('0x API error:', errorText)
      return new Response(
        JSON.stringify({ success: false, error: '0x API error: ' + errorText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    // Return swap data including calldata for contract execution
    return new Response(
      JSON.stringify({
        success: true,
        // Quote info
        toAmount: data.buyAmount,
        estimatedGas: data.estimatedGas || '0',
        protocols: data.sources?.filter((s: any) => parseFloat(s.proportion) > 0).map((s: any) => s.name) || [],
        priceImpact: data.estimatedPriceImpact || '0',
        // Execution data for contract
        routerAddress: data.to, // 0x router address
        swapData: data.data, // Calldata to execute the swap
        value: data.value || '0', // Value to send with the call
        minBuyAmount: data.guaranteedPrice 
          ? (BigInt(data.buyAmount) * 99n / 100n).toString() // 1% slippage protection
          : data.buyAmount,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    console.error('Swap data error:', errorMessage)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
