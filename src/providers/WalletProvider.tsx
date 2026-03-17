import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3AuthProvider } from '@web3auth/modal/react';
import { WEB3AUTH_NETWORK } from '@web3auth/modal';
import type { Web3AuthContextConfig } from '@web3auth/modal/react';

const queryClient = new QueryClient();

const WEB3AUTH_CLIENT_ID = 'BB7V6S0sAUaLJ8wETSFLy00pdthCoY2yQOAaLnEiHfuQpGLWRRlmHCxAzzkU_FUltrLnD7L5jGLSMbaUh-zCT8s';

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: WEB3AUTH_CLIENT_ID,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  },
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <Web3AuthProvider config={web3AuthContextConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Web3AuthProvider>
  );
};
