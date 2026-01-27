import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, polygon, arbitrum, base, bsc, type AppKitNetwork } from '@reown/appkit/networks';

// Get project ID from WalletConnect Cloud - this is a public project ID for demo
// In production, get your own at https://cloud.walletconnect.com
const projectId = 'c4f79cc821d9aa0d1fb2f3c0e4c29e89';

const metadata = {
  name: 'ReforestWallet',
  description: 'Clean swaps. Clean future.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://reforest.wallet',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, polygon, arbitrum, base, bsc];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#4ade80',
    '--w3m-color-mix': '#0a0f0a',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '12px',
  },
});

export const config = wagmiAdapter.wagmiConfig;
