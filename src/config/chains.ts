import { mainnet, polygon, arbitrum, base, bsc } from 'wagmi/chains';

export const SUPPORTED_CHAINS = [mainnet, polygon, arbitrum, base, bsc] as const;

export const CHAIN_INFO = {
  1: { name: 'Ethereum', icon: '⟠', color: '#627EEA', slug: 'ethereum' },
  137: { name: 'Polygon', icon: '⬡', color: '#8247E5', slug: 'polygon' },
  42161: { name: 'Arbitrum', icon: '🔵', color: '#28A0F0', slug: 'arbitrum' },
  8453: { name: 'Base', icon: '🔵', color: '#0052FF', slug: 'base' },
  56: { name: 'BNB Chain', icon: '🟡', color: '#F3BA2F', slug: 'bsc' },
} as const;

export type SupportedChainId = keyof typeof CHAIN_INFO;

// 1inch supported chain IDs
export const ONEINCH_CHAIN_IDS = [1, 137, 42161, 8453, 56] as const;
