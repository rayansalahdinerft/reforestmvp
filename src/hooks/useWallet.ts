import { useWeb3Auth, useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from '@web3auth/modal/react';
import { useCallback, useState, useEffect } from 'react';

/**
 * Unified wallet hook wrapping Web3Auth v10
 */
export const useWallet = () => {
  const { isConnected: web3AuthConnected, isInitializing, provider, initError } = useWeb3Auth();
  const { connect, loading: connectLoading } = useWeb3AuthConnect();
  const { disconnect: web3AuthDisconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();

  const [address, setAddress] = useState<string | null>(null);

  const ready = !isInitializing;

  useEffect(() => {
    const getAddress = async () => {
      if (web3AuthConnected && provider) {
        try {
          const accounts = await provider.request<never, string[]>({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (err) {
          console.error('Failed to get accounts:', err);
          setAddress(null);
        }
      } else {
        setAddress(null);
      }
    };
    getAddress();
  }, [web3AuthConnected, provider]);

  const authenticated = web3AuthConnected;
  const isConnected = ready && authenticated && !!address;

  const openConnect = useCallback(async () => {
    if (!ready || connectLoading) return;
    if (!authenticated) {
      try {
        await connect();
      } catch (error) {
        console.error('Web3Auth connect error:', error);
      }
    }
  }, [ready, authenticated, connect, connectLoading]);

  const disconnectWallet = useCallback(async () => {
    try {
      await web3AuthDisconnect();
    } catch (e) {
      console.error('Disconnect error:', e);
    }
    setAddress(null);
  }, [web3AuthDisconnect]);

  const getProvider = useCallback(async () => {
    return provider ?? null;
  }, [provider]);

  const user = userInfo ?? null;

  if (initError) {
    console.error('Web3Auth init error:', initError);
  }

  return {
    address,
    isConnected,
    ready,
    authenticated,
    chainId: 1,
    activeWallet: provider ? { address, chainId: '1' } : null,
    embeddedWallet: provider ? { address } : null,
    externalWallet: null,
    wallets: provider ? [{ address, walletClientType: 'web3auth' }] : [],
    user,
    connectors: [],
    isPending: !ready || connectLoading,
    openConnect,
    disconnect: disconnectWallet,
    getProvider,
  };
};
