import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID - get yours free at https://cloud.walletconnect.com
const WC_PROJECT_ID = 'cmm96j8ng01oa0cjp846ak29q';

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(), // MetaMask, Brave, etc.
    coinbaseWallet({ appName: 'ReforestWallet' }),
    walletConnect({ projectId: WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});
