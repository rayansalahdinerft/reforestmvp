// Fee recipient addresses for each chain
// These wallets receive the 1% fee from each swap

export const FEE_RECIPIENTS = {
  // EVM chains (Ethereum and L2s) - Impact address
  ethereum: '0x09a7d589709A4487e5C0cB3c74dEc41f8B219a0F',
  polygon: '0x09a7d589709A4487e5C0cB3c74dEc41f8B219a0F',
  arbitrum: '0x09a7d589709A4487e5C0cB3c74dEc41f8B219a0F',
  base: '0x09a7d589709A4487e5C0cB3c74dEc41f8B219a0F',
  bsc: '0x09a7d589709A4487e5C0cB3c74dEc41f8B219a0F',
  
  // Solana
  solana: 'A2P2damYLutEW74sBVZgcrpoJ1hYAMkfFKJEATa6PpWa',
  
  // Bitcoin (for future use)
  bitcoin: 'bc1pfunh5a0t8rhtyfc4d2yzj7q5kautxtg06tspxqxzg0ur9kcf6pkq82pk2z',
} as const;

export type ChainKey = keyof typeof FEE_RECIPIENTS;

export const getFeeRecipient = (chainKey: ChainKey): string => {
  return FEE_RECIPIENTS[chainKey];
};
