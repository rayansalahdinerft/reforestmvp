import { mainnet } from 'wagmi/chains';

// Only Ethereum mainnet is supported
export const SUPPORTED_EVM_CHAINS = [mainnet] as const;

export const CHAIN_INFO = {
  // Ethereum Mainnet only
  1: { 
    name: 'Ethereum', 
    icon: '⟠', 
    color: '#627EEA', 
    slug: 'ethereum', 
    type: 'evm' as const, 
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
    blockExplorer: 'https://etherscan.io'
  },
} as const;

export type SupportedChainId = keyof typeof CHAIN_INFO;
export type EVMChainId = 1;

// Supported chain IDs
export const SUPPORTED_CHAIN_IDS = [1] as const;
