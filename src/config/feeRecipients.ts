// Fee recipient addresses for each chain
// These wallets receive the 1% fee from each swap

export const FEE_RECIPIENTS = {
  // EVM chains (Ethereum and L2s) - Impact address
  ethereum: '0x0B9CEd290B0B48dAC1fA3DA88d219adFe6a998B2',
  polygon: '0x0B9CEd290B0B48dAC1fA3DA88d219adFe6a998B2',
  arbitrum: '0x0B9CEd290B0B48dAC1fA3DA88d219adFe6a998B2',
  base: '0x0B9CEd290B0B48dAC1fA3DA88d219adFe6a998B2',
  bsc: '0x0B9CEd290B0B48dAC1fA3DA88d219adFe6a998B2',
  
  // Solana
  solana: 'A2P2damYLutEW74sBVZgcrpoJ1hYAMkfFKJEATa6PpWa',
  
  // Bitcoin (for future use)
  bitcoin: 'bc1pfunh5a0t8rhtyfc4d2yzj7q5kautxtg06tspxqxzg0ur9kcf6pkq82pk2z',
} as const;

export type ChainKey = keyof typeof FEE_RECIPIENTS;

export const getFeeRecipient = (chainKey: ChainKey): string => {
  return FEE_RECIPIENTS[chainKey];
};
