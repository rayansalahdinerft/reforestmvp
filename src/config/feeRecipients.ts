// Fee recipient addresses for each chain
// These wallets receive the 1% fee from each swap

export const FEE_RECIPIENTS = {
  // EVM chains (Ethereum and L2s)
  ethereum: '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669',
  polygon: '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669',
  arbitrum: '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669',
  base: '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669',
  bsc: '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669',
  
  // Solana
  solana: 'A2P2damYLutEW74sBVZgcrpoJ1hYAMkfFKJEATa6PpWa',
  
  // Bitcoin (for future use)
  bitcoin: 'bc1pfunh5a0t8rhtyfc4d2yzj7q5kautxtg06tspxqxzg0ur9kcf6pkq82pk2z',
} as const;

export type ChainKey = keyof typeof FEE_RECIPIENTS;

export const getFeeRecipient = (chainKey: ChainKey): string => {
  return FEE_RECIPIENTS[chainKey];
};
