import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { config } from '@/config/wallet';

const queryClient = new QueryClient();

const PRIVY_APP_ID = 'cmm96j8ng01oa0cjp846ak29q';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#4ade80',
          showWalletLoginFirst: true,
        },
        loginMethods: ['wallet'],
        embeddedWallets: {
          ethereum: { createOnLogin: 'off' },
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
};
