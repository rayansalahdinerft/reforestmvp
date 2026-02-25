import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, type AppKitNetwork } from '@reown/appkit/networks';

// Get project ID from WalletConnect Cloud - this is a public project ID for demo
// In production, get your own at https://cloud.walletconnect.com
const projectId = 'c4f79cc821d9aa0d1fb2f3c0e4c29e89';

const metadata = {
  name: 'ReforestWallet',
  description: 'Clean swaps. Clean future.',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://reforest.wallet',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Only Ethereum for EVM chains (Solana handled separately)
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet];

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
  // Feature MetaMask, Coinbase, Trust Wallet, Rainbow
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
  ],
  features: {
    analytics: true,
    onramp: false,
    swaps: false,
    send: false,
    receive: false,
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
