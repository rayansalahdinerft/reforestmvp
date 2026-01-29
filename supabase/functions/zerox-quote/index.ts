import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// 0x API endpoints per chain (free tier available)
const ZEROX_ENDPOINTS: Record<number, string> = {
  1: 'https://api.0x.org',        // Ethereum
  137: 'https://polygon.api.0x.org', // Polygon
  42161: 'https://arbitrum.api.0x.org', // Arbitrum
  10: 'https://optimism.api.0x.org', // Optimism
  8453: 'https://base.api.0x.org', // Base
  43114: 'https://avalanche.api.0x.org', // Avalanche
  56: 'https://bsc.api.0x.org', // BSC
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { chainId, fromToken, toToken, amount, fromDecimals = 18, toDecimals = 18 } = await req.json()

    if (!chainId || !fromToken || !toToken || !amount) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const baseUrl = ZEROX_ENDPOINTS[chainId]
    if (!baseUrl) {
      return new Response(
        JSON.stringify({ success: false, error: `Chain ${chainId} not supported` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build 0x quote URL
    const params = new URLSearchParams({
      sellToken: fromToken,
      buyToken: toToken,
      sellAmount: amount,
    })

    const url = `${baseUrl}/swap/v1/quote?${params.toString()}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('0x API error:', errorText)
      
      // Fallback: use price-based estimation from CoinGecko
      return await getFallbackQuote(chainId, fromToken, toToken, amount, fromDecimals, toDecimals, corsHeaders)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({
        success: true,
        toAmount: data.buyAmount,
        estimatedGas: data.estimatedGas || '0',
        protocols: data.sources?.filter((s: any) => parseFloat(s.proportion) > 0).map((s: any) => s.name) || [],
        priceImpact: data.estimatedPriceImpact || '0',
        source: '0x',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Quote error:', errorMessage)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Fallback using CoinGecko prices
async function getFallbackQuote(
  chainId: number,
  fromToken: string,
  toToken: string,
  amount: string,
  fromDecimals: number,
  toDecimals: number,
  corsHeaders: Record<string, string>
) {
  try {
    // Map common token addresses to CoinGecko IDs
    const tokenToCoingecko: Record<string, string> = {
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ethereum',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC on Ethereum
      '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT on Ethereum
      '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai', // DAI on Ethereum
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC
    }

    const fromId = tokenToCoingecko[fromToken.toLowerCase()]
    const toId = tokenToCoingecko[toToken.toLowerCase()]

    if (!fromId || !toId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token not supported for price estimation' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${fromId},${toId}&vs_currencies=usd`
    const priceResponse = await fetch(priceUrl)
    const prices = await priceResponse.json()

    const fromPrice = prices[fromId]?.usd || 0
    const toPrice = prices[toId]?.usd || 1

    if (!fromPrice || !toPrice) {
      return new Response(
        JSON.stringify({ success: false, error: 'Could not fetch prices' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate estimated output with proper decimal handling
    // Formula: toAmount = (amount / 10^fromDecimals) * (fromPrice / toPrice) * 10^toDecimals * 0.997
    const amountNumber = parseFloat(amount) / Math.pow(10, fromDecimals)
    const toAmountNumber = amountNumber * (fromPrice / toPrice) * 0.997
    const toAmount = Math.floor(toAmountNumber * Math.pow(10, toDecimals))

    return new Response(
      JSON.stringify({
        success: true,
        toAmount: toAmount.toString(),
        estimatedGas: '200000',
        protocols: ['price-estimate'],
        priceImpact: '0.3',
        source: 'coingecko',
        isEstimate: true,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Fallback quote error:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to get price estimate' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
