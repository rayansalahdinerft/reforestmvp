import { useWeb3Auth } from '@web3auth/modal/react';
import { useCallback, useState, useEffect } from 'react';

/**
 * Unified wallet hook wrapping Web3Auth
 */
export const useWallet = () => {
  const {
    isConnected: web3AuthConnected,
    isInitialized,
    connect,
    disconnect: web3AuthDisconnect,
    provider,
    userInfo,
  } = useWeb3Auth();

  const [address, setAddress] = useState<string | null>(null);

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

  const ready = isInitialized;
  const authenticated = web3AuthConnected;
  const isConnected = ready && authenticated && !!address;

  const openConnect = useCallback(async () => {
    if (!ready) return;
    if (!authenticated) {
      try {
        await connect();
      } catch (error) {
        console.error('Web3Auth connect error:', error);
      }
    }
  }, [ready, authenticated, connect]);

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
    isPending: !ready,
    openConnect,
    disconnect: disconnectWallet,
    getProvider,
  };
};
