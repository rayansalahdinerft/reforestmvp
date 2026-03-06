import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { WagmiProvider } from 'wagmi';
import { config } from '@/config/wallet';

const queryClient = new QueryClient();

// Dynamic Environment ID (Sandbox)
const DYNAMIC_ENVIRONMENT_ID = 'dc2e8664-6a00-4e89-bed9-3f98245356aa';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        appName: 'ReforestWallet',
        appLogoUrl: '/icon.png',
        cssOverrides: `
          .dynamic-widget-inline-controls { background: transparent; }
          .dynamic-widget-card { border-radius: 1rem; }
          .dynamic-widget { font-family: inherit; }
        `,
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            {children}
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
