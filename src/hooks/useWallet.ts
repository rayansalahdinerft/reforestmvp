import { useWeb3AuthContext } from '@/providers/WalletProvider';
import { useCallback } from 'react';

/**
 * Unified wallet hook wrapping Web3Auth
 */
export const useWallet = () => {
  const {
    web3auth,
    provider,
    address,
    isConnected,
    ready,
    authenticated,
    user,
    login,
    logout,
  } = useWeb3AuthContext();

  const openConnect = useCallback(async () => {
    if (!ready) return;
    if (!authenticated) {
      await login();
    }
  }, [ready, authenticated, login]);

  const disconnect = useCallback(async () => {
    await logout();
  }, [logout]);

  const getProvider = useCallback(async () => {
    return provider ?? null;
  }, [provider]);

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
    disconnect,
    getProvider,
  };
};
