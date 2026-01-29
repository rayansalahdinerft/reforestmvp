import { mainnet } from 'wagmi/chains';

// For now, only Ethereum is enabled. More chains coming soon.
export const SUPPORTED_EVM_CHAINS = [mainnet] as const;

export const CHAIN_INFO = {
  // EVM Chains
  1: { 
    name: 'Ethereum', 
    icon: '⟠', 
    color: '#627EEA', 
    slug: 'ethereum', 
    type: 'evm' as const, 
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    blockExplorer: 'https://etherscan.io'
  },
  137: { 
    name: 'Polygon', 
    icon: '🟣', 
    color: '#8247E5', 
    slug: 'polygon', 
    type: 'evm' as const, 
    logoURI: 'https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png',
    blockExplorer: 'https://polygonscan.com'
  },
  42161: { 
    name: 'Arbitrum One', 
    icon: '🔵', 
    color: '#28A0F0', 
    slug: 'arbitrum', 
    type: 'evm' as const, 
    logoURI: 'https://tokens.1inch.io/0xb50721bcf8d664c30412cfbc6cf7a15145234ad1.png',
    blockExplorer: 'https://arbiscan.io'
  },
  10: { 
    name: 'Optimism', 
    icon: '🔴', 
    color: '#FF0420', 
    slug: 'optimism', 
    type: 'evm' as const, 
    logoURI: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    blockExplorer: 'https://optimistic.etherscan.io'
  },
  8453: { 
    name: 'Base', 
    icon: '🔷', 
    color: '#0052FF', 
    slug: 'base', 
    type: 'evm' as const, 
    logoURI: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png',
    blockExplorer: 'https://basescan.org'
  },
  43114: { 
    name: 'Avalanche C-Chain', 
    icon: '🔺', 
    color: '#E84142', 
    slug: 'avalanche', 
    type: 'evm' as const, 
    logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    blockExplorer: 'https://snowtrace.io'
  },
  56: { 
    name: 'BNB Chain', 
    icon: '🟡', 
    color: '#F0B90B', 
    slug: 'bsc', 
    type: 'evm' as const, 
    logoURI: 'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
    blockExplorer: 'https://bscscan.com'
  },
  // Solana (non-EVM, handled separately)
  'solana': { 
    name: 'Solana', 
    icon: '◎', 
    color: '#14F195', 
    slug: 'solana', 
    type: 'solana' as const, 
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    blockExplorer: 'https://solscan.io'
  },
  // Starknet (non-EVM, uses AVNU/Ekubo)
  'starknet': {
    name: 'Starknet',
    icon: '⬡',
    color: '#EC796B',
    slug: 'starknet',
    type: 'starknet' as const,
    logoURI: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png',
    blockExplorer: 'https://starkscan.co'
  },
} as const;

export type SupportedChainId = keyof typeof CHAIN_INFO;
export type EVMChainId = 1 | 137 | 42161 | 10 | 8453 | 43114 | 56;
export type SolanaChainId = 'solana';
export type StarknetChainId = 'starknet';

// 1inch supported chain IDs (EVM only)
export const ONEINCH_CHAIN_IDS = [1, 137, 42161, 10, 8453, 43114, 56] as const;

// Jupiter supported (Solana)
export const JUPITER_CHAIN_ID = 'solana' as const;

// AVNU/Ekubo supported (Starknet)
export const AVNU_CHAIN_ID = 'starknet' as const;
