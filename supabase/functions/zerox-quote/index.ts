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

// Comprehensive token address to CoinGecko ID mapping
const TOKEN_TO_COINGECKO: Record<string, string> = {
  // Native & Wrapped
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ethereum',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'weth',
  
  // Stablecoins
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether',
  '0x6b175474e89094c44da98b954eedfafdfd3f3ccc': 'dai',
  '0x853d955acef822db058eb8505911ed77f175b99e': 'frax',
  '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': 'liquity-usd',
  
  // Bitcoin
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin',
  
  // Staked ETH
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': 'staked-ether',
  '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': 'wrapped-steth',
  '0xae78736cd615f374d3085123a210448e74fc6393': 'rocket-pool-eth',
  '0xbe9895146f7af43049ca1c1ae358b0541ea49704': 'coinbase-wrapped-staked-eth',
  '0xac3e018457b222d93114458476f3e3416abbe38f': 'staked-frax-ether',
  
  // Memecoins
  '0x6982508145454ce325ddbe47a25d4ec3d2311933': 'pepe',
  '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': 'shiba-inu',
  '0x4206931337dc273a630d328da6441786bfad668f': 'dogecoin',
  '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e': 'floki',
  '0x1151cb3d861920e07a38e03eead12c32178567f6': 'bonk',
  '0xa1c5f1d76ece02ee26f40f7b6e45c8a55e96f7c6': 'dogwifcoin',
  '0xb131f4a55907b10d1f0a50d8ab8fa09ec342cd74': 'memecoin-2',
  '0xac57de9c1a09fec648e93eb98875b212db0d460b': 'baby-doge-coin',
  '0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3': 'dogelon-mars',
  '0xa35923162c49cf95e6bf26623385eb431ad920d3': 'turbo',
  '0x5026f006b85729a8b14553fae6af249ad16c9aab': 'wojak',
  '0x12970e6868f88f6557b76120662c1b3e50a646bf': 'milady-meme-coin',
  '0x7d8146cf21e8d7cbe46054e01588207b51198729': 'bob-token',
  '0x1ce270557c1f68cfb577b856766310bf8b47fd9c': 'mongcoin',
  '0x594daad7d77592a2b97b725a7ad59d7e188b5bfa': 'apu-apustaja',
  '0x812ba41e071c7b7fa4ebcfb62df5f45f6fa853ee': 'neiro-on-eth',
  '0xaaee1a9723aadb7afa2810263653a34ba2c21c7a': 'mog-coin',
  '0xe0f63a424a4439cbe457d80e4f4b51ad25b2c56c': 'spx6900',
  '0x7f9a7db853ca816b9a138aee3380ef34c437dee0': 'giga-chad-2',
  
  // DeFi
  '0x514910771af9ca656af840dff83e8264ecf986ca': 'chainlink',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap',
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'aave',
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': 'maker',
  '0xd533a949740bb3306d119cc777fa900ba034cd52': 'curve-dao-token',
  '0x5a98fcbea516cf06857215779fd812ca3bef1b32': 'lido-dao',
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': 'havven',
  '0xc00e94cb662c3520282e6f5717214004a7f26888': 'compound-governance-token',
  '0x111111111117dc0aa78b770fa6a738034120c302': '1inch',
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72': 'ethereum-name-service',
  '0xd33526068d116ce69f19a9ee46f0bd304f21a51f': 'rocket-pool',
  '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0': 'frax-share',
  '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b': 'convex-finance',
  '0xba100000625a3754423978a60c9317c58a424e3d': 'balancer',
  '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2': 'sushi',
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e': 'yearn-finance',
  '0xc944e90c64b2c07662a292be6244bdf05cda44a7': 'the-graph',
  '0x808507121b80c02388fad14726482e061b8da827': 'pendle',
  '0x57e114b691db790c35207b2e685d4a43181e6061': 'ethena',
  
  // L2 Tokens
  '0xb50721bcf8d664c30412cfbc6cf7a15145234ad1': 'arbitrum',
  '0x4200000000000000000000000000000000000042': 'optimism',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'matic-network',
  '0xca14007eff0db1f8135f4c25b34de49ab0d42766': 'starknet',
  '0xf57e7e7c23978c3caec3c3548e3d615c346e79ff': 'immutable-x',
  '0x95cef13441be50d20ca4558cc0a27b601ac544e5': 'manta-network',
  '0x9e32b13ce7f2e80a01932b42553652e053d6ed8e': 'metis-token',
  
  // Gaming & Metaverse
  '0x4d224452801aced8b2f0aebe155379bb5d594381': 'apecoin',
  '0x3845badade8e6dff049820680d1f14bd3903a5d0': 'the-sandbox',
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942': 'decentraland',
  '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b': 'axie-infinity',
  '0xd1d2eb1b1e90b638588728b4130137d262c87cae': 'gala',
  '0x767fe9edc9e0df98e07454847909b5e959d7ca0e': 'illuvium',
  
  // AI Tokens
  '0xaea46a60368a7bd060eec7df8cba43b7ef41ad85': 'fetch-ai',
  '0x6de037ef9ad2725eb40118bb1702ebb27e4aeb24': 'render-token',
  '0x967da4048cd07ab37855c090aaf366e4ce1b9f48': 'ocean-protocol',
  '0x5b7533812759b45c2b44c19e320ba2cd2681b542': 'singularitynet',
  '0x77e06c9eccf2e797fd462a92b6d7642ef85b0a44': 'bittensor',
  '0x6e2a43be0b1d33b726f0ca3b8de60b3482b8b050': 'arkham',
  '0x163f8c2467924be0ae7b5347228cabf260318753': 'worldcoin-wld',
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
    const fromId = TOKEN_TO_COINGECKO[fromToken.toLowerCase()]
    const toId = TOKEN_TO_COINGECKO[toToken.toLowerCase()]

    if (!fromId || !toId) {
      console.log('Tokens not in mapping:', fromToken, toToken)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'This token pair is not available for swapping. Try a different pair.' 
        }),
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
        JSON.stringify({ success: false, error: 'Could not fetch prices for this pair' }),
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
