import { usePrivy, useWallets, useCreateWallet } from '@privy-io/react-auth';
import { useCallback, useMemo } from 'react';

/**
 * Unified wallet hook wrapping Privy
 */
export const useWallet = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();

  const embeddedWallet = useMemo(
    () => wallets.find((wallet: any) => wallet.walletClientType === 'privy') ?? null,
    [wallets]
  );

  const externalWallet = useMemo(
    () => wallets.find((wallet: any) => wallet.walletClientType !== 'privy') ?? null,
    [wallets]
  );

  const activeWallet = embeddedWallet ?? externalWallet ?? null;
  const address = activeWallet?.address ?? null;
  const isConnected = ready && authenticated && !!address;
  const chainId = activeWallet?.chainId ? Number(activeWallet.chainId.split(':')[1]) : undefined;

  const openConnect = useCallback(async () => {
    if (!ready) return;

    if (authenticated) {
      if (!embeddedWallet) {
        try {
          await createWallet();
        } catch (error) {
          console.error('Failed to create embedded wallet:', error);
        }
      }
      return;
    }

    login();
  }, [ready, authenticated, embeddedWallet, createWallet, login]);

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
    embeddedWallet,
    externalWallet,
    wallets,
    user,
    connectors: [],
    isPending: !ready,
    openConnect,
    disconnect,
    getProvider,
  };
};
