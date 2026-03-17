import { ReactNode, createContext, useContext, useState, useEffect, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, IProvider } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';

const queryClient = new QueryClient();

const WEB3AUTH_CLIENT_ID = 'BB7V6S0sAUaLJ8wETSFLy00pdthCoY2yQOAaLnEiHfuQpGLWRRlmHCxAzzkU_FUltrLnD7L5jGLSMbaUh-zCT8s';

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155 as const,
  chainId: '0x1',
  rpcTarget: 'https://eth.llamarpc.com',
  displayName: 'Ethereum Mainnet',
  blockExplorerUrl: 'https://etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

const web3auth = new Web3Auth({
  clientId: WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
});

export interface Web3AuthContextType {
  web3auth: Web3Auth;
  provider: IProvider | null;
  address: string | null;
  isConnected: boolean;
  ready: boolean;
  authenticated: boolean;
  user: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth,
  provider: null,
  address: null,
  isConnected: false,
  ready: false,
  authenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const useWeb3AuthContext = () => useContext(Web3AuthContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const fetchAccountInfo = useCallback(async (web3Provider: IProvider) => {
    try {
      const accounts = await web3Provider.request<never, string[]>({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
      }
      try {
        const userInfo = await web3auth.getUserInfo();
        setUser(userInfo);
      } catch {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to get accounts:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        if (web3auth.connected && web3auth.provider) {
          setProvider(web3auth.provider);
          setAuthenticated(true);
          await fetchAccountInfo(web3auth.provider);
        }
      } catch (error) {
        console.error('Web3Auth init error:', error);
      }
      setReady(true);
    };
    init();
  }, [fetchAccountInfo]);

  const login = useCallback(async () => {
    try {
      const web3authProvider = await web3auth.connect();
      if (web3authProvider) {
        setProvider(web3authProvider);
        setAuthenticated(true);
        await fetchAccountInfo(web3authProvider);
      }
    } catch (error) {
      console.error('Web3Auth login error:', error);
    }
  }, [fetchAccountInfo]);

  const logout = useCallback(async () => {
    try {
      await web3auth.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setProvider(null);
    setAddress(null);
    setAuthenticated(false);
    setUser(null);
  }, []);

  const value: Web3AuthContextType = {
    web3auth,
    provider,
    address,
    isConnected: ready && authenticated && !!address,
    ready,
    authenticated,
    user,
    login,
    logout,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Web3AuthContext.Provider>
  );
};
