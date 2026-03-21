import { useDynamicContext, useIsLoggedIn, useUserWallets } from '@dynamic-labs/sdk-react-core';
import { useCallback } from 'react';

/**
 * Unified wallet hook wrapping Dynamic.xyz
 */
export const useWallet = () => {
  const { sdkHasLoaded, setShowAuthFlow, handleLogOut, user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const userWallets = useUserWallets();

  const primaryWallet = userWallets?.[0] ?? null;
  const address = primaryWallet?.address ?? null;

  const ready = sdkHasLoaded;
  const authenticated = isLoggedIn;
  const isConnected = ready && authenticated && !!address;

  const openConnect = useCallback(() => {
    if (!ready) return;
    if (!authenticated) {
      setShowAuthFlow(true);
    }
  }, [ready, authenticated, setShowAuthFlow]);

  const disconnectWallet = useCallback(async () => {
    try {
      await handleLogOut();
    } catch (e) {
      console.error('Disconnect error:', e);
    }
  }, [handleLogOut]);

  const getProvider = useCallback(async () => {
    if (!primaryWallet) return null;
    try {
      return await (primaryWallet as any).getWalletClient();
    } catch {
      return null;
    }
  }, [primaryWallet]);

  return {
    address,
    isConnected,
    ready,
    authenticated,
    chainId: 1,
    activeWallet: primaryWallet ? { address, chainId: '1' } : null,
    embeddedWallet: primaryWallet ? { address } : null,
    externalWallet: null,
    wallets: userWallets?.map(w => ({ address: w.address, walletClientType: 'dynamic' })) ?? [],
    user: user ?? null,
    connectors: [],
    isPending: !ready,
    openConnect,
    disconnect: disconnectWallet,
    getProvider,
  };
};
