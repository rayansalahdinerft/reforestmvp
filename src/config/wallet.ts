import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});
