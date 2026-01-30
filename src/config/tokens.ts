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

// All tokens on Ethereum Mainnet - including major memecoins
export const POPULAR_TOKENS: Record<number | string, Token[]> = {
  // Ethereum Mainnet (1) - Comprehensive list
  1: [
    // Native & Wrapped
    { symbol: 'ETH', name: 'Ethereum', address: NATIVE_TOKEN, decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
    
    // Stablecoins
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, chainId: 1, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, chainId: 1, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EesdfafdD3F3cCC', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png' },
    { symbol: 'FRAX', name: 'Frax', address: '0x853d955aCEf822Db058eb8505911ED77F175b99e', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/13422/small/FRAX_icon.png' },
    { symbol: 'LUSD', name: 'Liquity USD', address: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/14666/small/Group_3.png' },
    
    // Bitcoin
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, chainId: 1, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    
    // Staked ETH
    { symbol: 'stETH', name: 'Lido Staked ETH', address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xae7ab96520de3a18e5e111b5eaab095312d7fe84.png' },
    { symbol: 'wstETH', name: 'Wrapped stETH', address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/18834/small/wstETH.png' },
    { symbol: 'rETH', name: 'Rocket Pool ETH', address: '0xae78736Cd615f374D3085123A210448E74Fc6393', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xae78736cd615f374d3085123a210448e74fc6393.png' },
    { symbol: 'cbETH', name: 'Coinbase ETH', address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/27008/small/cbeth.png' },
    { symbol: 'sfrxETH', name: 'Staked Frax ETH', address: '0xac3E018457B222d93114458476f3E3416Abbe38F', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/28285/small/sfrxETH_icon.png' },
    
    // 🐸 MEMECOINS - Only major ones with reliable data
    { symbol: 'PEPE', name: 'Pepe', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg' },
    { symbol: 'SHIB', name: 'Shiba Inu', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.png' },
    { symbol: 'FLOKI', name: 'Floki Inu', address: '0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E', decimals: 9, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/16746/small/PNG_image.png' },
    { symbol: 'BONK', name: 'Bonk', address: '0x1151CB3d861920e07a38e03eEAd12C32178567F6', decimals: 5, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg' },
    { symbol: 'MEME', name: 'Memecoin', address: '0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/32528/small/memecoin.jpg' },
    { symbol: 'ELON', name: 'Dogelon Mars', address: '0x761D38e5ddf6ccf6Cf7c55759d5210750B5D60F3', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/14962/small/6GxcPRo3_400x400.jpg' },
    { symbol: 'TURBO', name: 'Turbo', address: '0xA35923162C49cF95e6BF26623385eb431ad920D3', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/30117/small/turbo.jpg' },
    { symbol: 'MOG', name: 'Mog Coin', address: '0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/31287/small/mog.jpg' },
    
    // DeFi Blue Chips
    { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png' },
    { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png' },
    { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png' },
    { symbol: 'MKR', name: 'Maker', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2.png' },
    { symbol: 'CRV', name: 'Curve DAO', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xd533a949740bb3306d119cc777fa900ba034cd52.png' },
    { symbol: 'LDO', name: 'Lido DAO', address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x5a98fcbea516cf06857215779fd812ca3bef1b32.png' },
    { symbol: 'SNX', name: 'Synthetix', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f.png' },
    { symbol: 'COMP', name: 'Compound', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png' },
    { symbol: '1INCH', name: '1inch', address: '0x111111111117dC0aa78b770fA6A738034120C302', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x111111111117dc0aa78b770fa6a738034120c302.png' },
    { symbol: 'ENS', name: 'Ethereum Name Service', address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg' },
    { symbol: 'RPL', name: 'Rocket Pool', address: '0xD33526068D116cE69F19A9ee46F0bd304F21A51f', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/2090/small/rocket_pool_%28RPL%29.png' },
    { symbol: 'FXS', name: 'Frax Share', address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/13423/small/Frax_Shares_icon.png' },
    { symbol: 'CVX', name: 'Convex Finance', address: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/15585/small/convex.png' },
    { symbol: 'BAL', name: 'Balancer', address: '0xba100000625a3754423978a60c9317c58a424e3D', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xba100000625a3754423978a60c9317c58a424e3d.png' },
    { symbol: 'SUSHI', name: 'SushiSwap', address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2.png' },
    { symbol: 'YFI', name: 'yearn.finance', address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e.png' },
    { symbol: 'GRT', name: 'The Graph', address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png' },
    { symbol: 'PENDLE', name: 'Pendle', address: '0x808507121B80c02388fAd14726482e061B8da827', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png' },
    { symbol: 'ENA', name: 'Ethena', address: '0x57e114B691Db790C35207b2e685D4A43181e6061', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/36530/small/ethena.png' },
    
    // L2 Tokens (on Ethereum)
    { symbol: 'ARB', name: 'Arbitrum', address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png' },
    { symbol: 'OP', name: 'Optimism', address: '0x4200000000000000000000000000000000000042', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
    
    { symbol: 'STRK', name: 'Starknet', address: '0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png' },
    { symbol: 'IMX', name: 'Immutable X', address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png' },
    { symbol: 'MANTA', name: 'Manta Network', address: '0x95CeF13441Be50d20cA4558CC0a27B601aC544E5', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/33535/small/manta.jpg' },
    { symbol: 'METIS', name: 'Metis', address: '0x9E32b13ce7f2E80A01932B42553652E053D6ed8e', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/15595/small/metis.PNG' },
    
    // Gaming & Metaverse
    { symbol: 'APE', name: 'ApeCoin', address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0x4d224452801aced8b2f0aebe155379bb5d594381.png' },
    { symbol: 'SAND', name: 'The Sandbox', address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg' },
    { symbol: 'MANA', name: 'Decentraland', address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png' },
    { symbol: 'AXS', name: 'Axie Infinity', address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png' },
    { symbol: 'GALA', name: 'Gala', address: '0xd1d2Eb1B1e90B638588728b4130137D262C87cae', decimals: 8, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png' },
    { symbol: 'ILV', name: 'Illuvium', address: '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/14468/small/logo-200x200.png' },
    
    // AI Tokens
    { symbol: 'FET', name: 'Fetch.ai', address: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg' },
    { symbol: 'RNDR', name: 'Render Token', address: '0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png' },
    { symbol: 'OCEAN', name: 'Ocean Protocol', address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/3687/small/ocean-protocol-logo.jpg' },
    { symbol: 'AGIX', name: 'SingularityNET', address: '0x5B7533812759B45C2B44C19e320ba2cD2681b542', decimals: 8, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/2138/small/singularitynet.png' },
    { symbol: 'TAO', name: 'Bittensor', address: '0x77E06c9eCCf2E797fd462A92B6D7642EF85b0A44', decimals: 9, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/28452/small/ARUsPeNQ_400x400.jpeg' },
    { symbol: 'ARKM', name: 'Arkham', address: '0x6E2a43be0B1d33b726f0CA3b8de60b3482b8b050', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/30929/small/arkham.png' },
    { symbol: 'WLD', name: 'Worldcoin', address: '0x163f8C2467924be0ae7B5347228CABF260318753', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/31069/small/worldcoin.jpeg' },
  ],
};

// Get tokens for a specific chain
export const getTokensForChain = (chainId: number | string): Token[] => {
  return POPULAR_TOKENS[chainId] || [];
};

// Search tokens across all chains or specific chain
export const searchTokens = (query: string, chainId?: number | string): Token[] => {
  const normalizedQuery = query.toLowerCase();
  
  if (chainId !== undefined) {
    const tokens = POPULAR_TOKENS[chainId] || [];
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(normalizedQuery) ||
      token.name.toLowerCase().includes(normalizedQuery)
    );
  }
  
  // Search across all chains
  return Object.values(POPULAR_TOKENS)
    .flat()
    .filter(token => 
      token.symbol.toLowerCase().includes(normalizedQuery) ||
      token.name.toLowerCase().includes(normalizedQuery)
    );
};
