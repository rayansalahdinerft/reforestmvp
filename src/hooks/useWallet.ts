import { useDynamicContext, useIsLoggedIn, useUserWallets } from '@dynamic-labs/sdk-react-core';
import { useCallback } from 'react';

/**
 * Unified wallet hook wrapping Dynamic.xyz
 */
export const useWallet = () => {
  const { setShowAuthFlow, handleLogOut, user, sdkHasLoaded, primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const userWallets = useUserWallets();

  const activeWallet = primaryWallet ?? userWallets[0] ?? null;
  const address = activeWallet?.address ?? null;
  const isConnected = sdkHasLoaded && isLoggedIn && !!address;
  const chainId = activeWallet?.chain ? Number(activeWallet.chain) : undefined;

  const openConnect = useCallback(() => {
    setShowAuthFlow(true);
  }, [setShowAuthFlow]);

  const disconnect = useCallback(async () => {
    await handleLogOut();
  }, [handleLogOut]);

  const getProvider = useCallback(async () => {
    if (!activeWallet) return null;
    try {
      return await (activeWallet as any).getWalletClient();
    } catch {
      return null;
    }
  }, [activeWallet]);

  return {
    address,
    isConnected,
    ready: sdkHasLoaded,
    authenticated: isLoggedIn,
    chainId,
    activeWallet,
    wallets: userWallets,
    user,
    connectors: [],
    isPending: !sdkHasLoaded,
    openConnect,
    disconnect,
    getProvider,
  };
};
