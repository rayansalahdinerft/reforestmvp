import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

// Simple wagmi config for on-chain reads (balance, contracts)
export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});
