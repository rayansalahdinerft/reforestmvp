import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback } from 'react';

/**
 * Unified wallet hook wrapping Privy
 */
export const useWallet = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const activeWallet = wallets[0] ?? null;
  const address = activeWallet?.address ?? null;
  const isConnected = ready && authenticated && !!address;
  const chainId = activeWallet?.chainId ? Number(activeWallet.chainId.split(':')[1]) : undefined;

  const openConnect = useCallback(() => {
    login();
  }, [login]);

  const disconnect = useCallback(async () => {
    await logout();
  }, [logout]);

  const getProvider = useCallback(async () => {
    if (!activeWallet) return null;
    try {
      return await activeWallet.getEthereumProvider();
    } catch {
      return null;
    }
  }, [activeWallet]);

  return {
    address,
    isConnected,
    ready,
    authenticated,
    chainId,
    activeWallet,
    wallets,
    user,
    connectors: [],
    isPending: !ready,
    openConnect,
    disconnect,
    getProvider,
  };
};
