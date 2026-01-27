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
  // Ethereum Mainnet
  1: [
    { symbol: 'ETH', name: 'Ethereum', address: NATIVE_TOKEN, decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png' },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, chainId: 1, logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png' },
    { symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, chainId: 1, logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8, chainId: 1, logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png' },
    { symbol: 'WETH', name: 'Wrapped Ether', address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, chainId: 1, logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png' },
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
  ],
};

export const getTokensForChain = (chainId: number | string): Token[] => {
  return POPULAR_TOKENS[chainId] || [];
};
