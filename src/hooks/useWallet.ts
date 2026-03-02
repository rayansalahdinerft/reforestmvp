import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useMemo } from 'react';

/**
 * Unified wallet hook that wraps Privy.
 * Drop-in replacement for the old useAppKitAccount / useAppKit pattern.
 */
export const useWallet = () => {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { wallets } = useWallets();

  const activeWallet = wallets[0] ?? null;
  const address = activeWallet?.address ?? null;
  const isConnected = ready && authenticated && !!address;
  const chainId = activeWallet?.chainId ? Number(activeWallet.chainId.split(':')[1]) : undefined;

  const openConnect = useCallback(() => {
    login();
  }, [login]);

  const openAccount = useCallback(() => {
    // Privy doesn't have a separate account view, just re-open login which shows account if connected
    login();
  }, [login]);

  const disconnect = useCallback(async () => {
    await logout();
  }, [logout]);

  // Get an ethers/viem provider from the active wallet
  const getProvider = useCallback(async () => {
    if (!activeWallet) return null;
    return await activeWallet.getEthereumProvider();
  }, [activeWallet]);

  return {
    address,
    isConnected,
    ready,
    authenticated,
    chainId,
    user,
    activeWallet,
    wallets,
    openConnect,
    openAccount,
    disconnect,
    getProvider,
  };
};
