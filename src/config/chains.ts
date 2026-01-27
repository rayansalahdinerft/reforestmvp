import { mainnet } from 'wagmi/chains';

// For now, only Ethereum is enabled. Solana will be handled separately.
export const SUPPORTED_EVM_CHAINS = [mainnet] as const;

export const CHAIN_INFO = {
  // EVM Chains
  1: { name: 'Ethereum', icon: '⟠', color: '#627EEA', slug: 'ethereum', type: 'evm' as const },
  // Solana (non-EVM, handled separately)
  'solana': { name: 'Solana', icon: '◎', color: '#14F195', slug: 'solana', type: 'solana' as const },
} as const;

export type SupportedChainId = keyof typeof CHAIN_INFO;
export type EVMChainId = 1;
export type SolanaChainId = 'solana';

// 1inch supported chain IDs (EVM only)
export const ONEINCH_CHAIN_IDS = [1] as const;

// Jupiter supported (Solana)
export const JUPITER_CHAIN_ID = 'solana' as const;
