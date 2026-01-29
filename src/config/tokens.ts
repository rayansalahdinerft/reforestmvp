export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  chainId: number | string;
}

// Native token address placeholder
const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const SOL_NATIVE = 'So11111111111111111111111111111111111111112';

// Popular tokens by chain
export const POPULAR_TOKENS: Record<number | string, Token[]> = {
  // Ethereum Mainnet (1)
  1: [
    { symbol: 'ETH', name: 'Ethereum', address: NATIVE_TOKEN, decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, chainId: 1, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, chainId: 1, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, chainId: 1, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
    { symbol: 'stETH', name: 'Lido Staked ETH', address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xae7ab96520de3a18e5e111b5eaab095312d7fe84.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EesdfafdD3F3cCC', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png' },
    { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png' },
    { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png' },
    { symbol: 'MKR', name: 'Maker', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2.png' },
    { symbol: 'CRV', name: 'Curve DAO', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xd533a949740bb3306d119cc777fa900ba034cd52.png' },
    { symbol: 'LDO', name: 'Lido DAO', address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x5a98fcbea516cf06857215779fd812ca3bef1b32.png' },
    { symbol: 'SHIB', name: 'Shiba Inu', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.png' },
    { symbol: 'PEPE', name: 'Pepe', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
    { symbol: 'ARB', name: 'Arbitrum', address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png' },
    { symbol: 'OP', name: 'Optimism', address: '0x4200000000000000000000000000000000000042', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
    { symbol: 'MATIC', name: 'Polygon', address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png' },
    { symbol: 'APE', name: 'ApeCoin', address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x4d224452801aced8b2f0aebe155379bb5d594381.png' },
    { symbol: 'SNX', name: 'Synthetix', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png' },
    { symbol: 'COMP', name: 'Compound', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png' },
    { symbol: 'rETH', name: 'Rocket Pool ETH', address: '0xae78736Cd615f374D3085123A210448E74Fc6393', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png' },
    { symbol: 'cbETH', name: 'Coinbase ETH', address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/27008/small/cbeth.png' },
  ],
  
  // Polygon (137)
  137: [
    { symbol: 'MATIC', name: 'Polygon', address: NATIVE_TOKEN, decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6, chainId: 137, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDC.e', name: 'Bridged USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, chainId: 137, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, chainId: 137, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8, chainId: 137, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'LINK', name: 'Chainlink', address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png' },
    { symbol: 'AAVE', name: 'Aave', address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png' },
    { symbol: 'UNI', name: 'Uniswap', address: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png' },
    { symbol: 'CRV', name: 'Curve DAO', address: '0x172370d5Cd63279eFa6d502DAB29171933a610AF', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0xd533a949740bb3306d119cc777fa900ba034cd52.png' },
    { symbol: 'WMATIC', name: 'Wrapped MATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png' },
    { symbol: 'stMATIC', name: 'Staked MATIC', address: '0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4', decimals: 18, chainId: 137, logoURI: 'https://assets.coingecko.com/coins/images/24185/small/stMATIC.png' },
    { symbol: 'QUICK', name: 'QuickSwap', address: '0xB5C064F955D8e7F38fE0460C556a72987494eE17', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0x831753dd7087cac61ab5644b308642cc1c33dc13.png' },
    { symbol: 'BAL', name: 'Balancer', address: '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3', decimals: 18, chainId: 137, logoURI: 'https://tokens.1inch.io/0xba100000625a3754423978a60c9317c58a424e3d.png' },
  ],
  
  // Arbitrum One (42161)
  42161: [
    { symbol: 'ETH', name: 'Ethereum', address: NATIVE_TOKEN, decimals: 18, chainId: 42161, logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'ARB', name: 'Arbitrum', address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, chainId: 42161, logoURI: 'https://tokens.1inch.io/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6, chainId: 42161, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6, chainId: 42161, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6, chainId: 42161, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8, chainId: 42161, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18, chainId: 42161, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18, chainId: 42161, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'LINK', name: 'Chainlink', address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', decimals: 18, chainId: 42161, logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png' },
    { symbol: 'UNI', name: 'Uniswap', address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0', decimals: 18, chainId: 42161, logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png' },
    { symbol: 'GMX', name: 'GMX', address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', decimals: 18, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/18323/small/arbit.png' },
    { symbol: 'GNS', name: 'Gains Network', address: '0x18c11FD286C5EC11c3b683Caa813B77f5163A122', decimals: 18, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/19737/small/logo.png' },
    { symbol: 'MAGIC', name: 'Magic', address: '0x539bdE0d7Dbd336b79148AA742883198BBF60342', decimals: 18, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/18623/small/magic.png' },
    { symbol: 'RDNT', name: 'Radiant', address: '0x3082CC23568eA640225c2467653dB90e9250AaA0', decimals: 18, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/26536/small/Radiant-Logo-200x200.png' },
    { symbol: 'PENDLE', name: 'Pendle', address: '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8', decimals: 18, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png' },
  ],
  
  // Optimism (10)
  10: [
    { symbol: 'ETH', name: 'Ethereum', address: NATIVE_TOKEN, decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'OP', name: 'Optimism', address: '0x4200000000000000000000000000000000000042', decimals: 18, chainId: 10, logoURI: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6, chainId: 10, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDC.e', name: 'Bridged USDC', address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimals: 6, chainId: 10, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6, chainId: 10, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095', decimals: 8, chainId: 10, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'LINK', name: 'Chainlink', address: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6', decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png' },
    { symbol: 'SNX', name: 'Synthetix', address: '0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4', decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png' },
    { symbol: 'sUSD', name: 'sUSD', address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9', decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0x57ab1ec28d129707052df4df418d58a2d46d5f51.png' },
    { symbol: 'VELO', name: 'Velodrome', address: '0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db', decimals: 18, chainId: 10, logoURI: 'https://assets.coingecko.com/coins/images/25783/small/velo.png' },
    { symbol: 'PERP', name: 'Perpetual Protocol', address: '0x9e1028F5F1D5eDE59748FFceE5532509976840E0', decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0xbc396689893d065f41bc2c6ecbee5e0085233447.png' },
    { symbol: 'AAVE', name: 'Aave', address: '0x76FB31fb4af56892A25e32cFC43De717950c9278', decimals: 18, chainId: 10, logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png' },
  ],
  
  // Base (8453)
  8453: [
    { symbol: 'ETH', name: 'Ethereum', address: NATIVE_TOKEN, decimals: 18, chainId: 8453, logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, chainId: 8453, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDbC', name: 'Bridged USDC', address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', decimals: 6, chainId: 8453, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0x4200000000000000000000000000000000000006', decimals: 18, chainId: 8453, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, chainId: 8453, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'cbETH', name: 'Coinbase ETH', address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/27008/small/cbeth.png' },
    { symbol: 'rETH', name: 'Rocket Pool ETH', address: '0xB6fe221Fe9EeF5aBa221c348bA20A1Bf5e73624c', decimals: 18, chainId: 8453, logoURI: 'https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png' },
    { symbol: 'AERO', name: 'Aerodrome', address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/31745/small/token.png' },
    { symbol: 'BRETT', name: 'Brett', address: '0x532f27101965dd16442E59d40670FaF5eBB142E4', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/35529/small/brett.png' },
    { symbol: 'DEGEN', name: 'Degen', address: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/34515/small/degen.png' },
    { symbol: 'TOSHI', name: 'Toshi', address: '0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/31126/small/toshi.png' },
    { symbol: 'WELL', name: 'Moonwell', address: '0xA88594D404727625A9437C3f886C7643872296AE', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/26133/small/WELL.png' },
  ],
  
  // Avalanche C-Chain (43114)
  43114: [
    { symbol: 'AVAX', name: 'Avalanche', address: NATIVE_TOKEN, decimals: 18, chainId: 43114, logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', decimals: 6, chainId: 43114, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664', decimals: 6, chainId: 43114, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', decimals: 6, chainId: 43114, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'WETH.e', name: 'Wrapped Ether', address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', decimals: 18, chainId: 43114, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
    { symbol: 'WBTC.e', name: 'Wrapped Bitcoin', address: '0x50b7545627a5162F82A992c33b87aDc75187B218', decimals: 8, chainId: 43114, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'WAVAX', name: 'Wrapped AVAX', address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', decimals: 18, chainId: 43114, logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
    { symbol: 'DAI.e', name: 'Dai Stablecoin', address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', decimals: 18, chainId: 43114, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'LINK.e', name: 'Chainlink', address: '0x5947BB275c521040051D82396192181b413227A3', decimals: 18, chainId: 43114, logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png' },
    { symbol: 'AAVE.e', name: 'Aave', address: '0x63a72806098Bd3D9520cC43356dD78afe5D386D9', decimals: 18, chainId: 43114, logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png' },
    { symbol: 'JOE', name: 'Trader Joe', address: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd', decimals: 18, chainId: 43114, logoURI: 'https://assets.coingecko.com/coins/images/17569/small/traderjoe.png' },
    { symbol: 'sAVAX', name: 'Staked AVAX', address: '0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE', decimals: 18, chainId: 43114, logoURI: 'https://assets.coingecko.com/coins/images/23657/small/sAVAX.png' },
    { symbol: 'GMX', name: 'GMX', address: '0x62edc0692BD897D2295872a9FFCac5425011c661', decimals: 18, chainId: 43114, logoURI: 'https://assets.coingecko.com/coins/images/18323/small/arbit.png' },
  ],
  
  // BNB Chain (56)
  56: [
    { symbol: 'BNB', name: 'BNB', address: NATIVE_TOKEN, decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png' },
    { symbol: 'USDT', name: 'Tether', address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'BUSD', name: 'Binance USD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0x4fabb145d64652a948d72533023f6e7a623c7c53.png' },
    { symbol: 'WBNB', name: 'Wrapped BNB', address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png' },
    { symbol: 'ETH', name: 'Ethereum', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'BTCB', name: 'Bitcoin BEP2', address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'CAKE', name: 'PancakeSwap', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82.png' },
    { symbol: 'XVS', name: 'Venus', address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63.png' },
    { symbol: 'LINK', name: 'Chainlink', address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png' },
    { symbol: 'UNI', name: 'Uniswap', address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png' },
    { symbol: 'AAVE', name: 'Aave', address: '0xfb6115445Bff7b52FeB98650C87f44907E58f802', decimals: 18, chainId: 56, logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png' },
    { symbol: 'DOGE', name: 'Dogecoin', address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43', decimals: 8, chainId: 56, logoURI: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
    { symbol: 'FLOKI', name: 'Floki', address: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E', decimals: 9, chainId: 56, logoURI: 'https://assets.coingecko.com/coins/images/16746/small/FLOKI.png' },
  ],
  
  // Solana
  'solana': [
    { symbol: 'SOL', name: 'Solana', address: SOL_NATIVE, decimals: 9, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
    { symbol: 'USDC', name: 'USD Coin', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png' },
    { symbol: 'USDT', name: 'Tether', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg' },
    { symbol: 'JUP', name: 'Jupiter', address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', decimals: 6, chainId: 'solana', logoURI: 'https://static.jup.ag/jup/icon.png' },
    { symbol: 'RAY', name: 'Raydium', address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', decimals: 6, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png' },
    { symbol: 'BONK', name: 'Bonk', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', decimals: 5, chainId: 'solana', logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I' },
    { symbol: 'WIF', name: 'dogwifhat', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', decimals: 6, chainId: 'solana', logoURI: 'https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betiez6v2x7z3bvnb6qeu.ipfs.nftstorage.link/' },
    { symbol: 'PYTH', name: 'Pyth Network', address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', decimals: 6, chainId: 'solana', logoURI: 'https://pyth.network/token.svg' },
    { symbol: 'JTO', name: 'Jito', address: 'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL', decimals: 9, chainId: 'solana', logoURI: 'https://metadata.jito.network/token/jto/image' },
    { symbol: 'ORCA', name: 'Orca', address: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE', decimals: 6, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE/logo.png' },
    { symbol: 'MNDE', name: 'Marinade', address: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey', decimals: 9, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png' },
    { symbol: 'mSOL', name: 'Marinade SOL', address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', decimals: 9, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png' },
    { symbol: 'stSOL', name: 'Lido Staked SOL', address: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', decimals: 9, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj/logo.png' },
    { symbol: 'RENDER', name: 'Render Token', address: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof', decimals: 8, chainId: 'solana', logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof/logo.png' },
    { symbol: 'HNT', name: 'Helium', address: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux', decimals: 8, chainId: 'solana', logoURI: 'https://shdw-drive.genesysgo.net/CYPATNok4MgmzfUx8EVkKc3BZ7VPzcdPKQrMCg8n6Qet/hnt.png' },
    { symbol: 'TRUMP', name: 'Official Trump', address: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN', decimals: 6, chainId: 'solana', logoURI: 'https://assets.coingecko.com/coins/images/53746/small/trump.jpg' },
  ],

  // Starknet
  'starknet': [
    { symbol: 'ETH', name: 'Ethereum', address: '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', decimals: 18, chainId: 'starknet', logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'STRK', name: 'Starknet', address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', decimals: 18, chainId: 'starknet', logoURI: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', decimals: 6, chainId: 'starknet', logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', decimals: 6, chainId: 'starknet', logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3', decimals: 18, chainId: 'starknet', logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', decimals: 8, chainId: 'starknet', logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'wstETH', name: 'Lido wstETH', address: '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', decimals: 18, chainId: 'starknet', logoURI: 'https://assets.coingecko.com/coins/images/18834/small/wstETH.png' },
    { symbol: 'LORDS', name: 'Lords', address: '0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49', decimals: 18, chainId: 'starknet', logoURI: 'https://assets.coingecko.com/coins/images/22171/small/Frame_5.png' },
    { symbol: 'ZEND', name: 'zkLend', address: '0x00585c32b625999e6e5e78645ff8df7a9001cf5cf3eb6b80ccdd16cb64bd3a34', decimals: 18, chainId: 'starknet', logoURI: 'https://assets.coingecko.com/coins/images/36690/small/zend.jpg' },
    { symbol: 'NSTR', name: 'Nostra', address: '0x04619e9ce4109590219c5263787050726be63382148538f3f936c22aa87d2fc2', decimals: 18, chainId: 'starknet', logoURI: 'https://assets.coingecko.com/coins/images/38632/small/nostra.jpg' },
  ],
};

export const getTokensForChain = (chainId: number | string): Token[] => {
  return POPULAR_TOKENS[chainId] || [];
};
