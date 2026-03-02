import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useCallback } from 'react';

/**
 * Unified wallet hook wrapping wagmi native connectors.
 * Drop-in replacement for the old useAppKitAccount / useAppKit pattern.
 */
export const useWallet = () => {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const chainId = chain?.id;

  const openConnect = useCallback(async (connectorId?: string) => {
    if (connectorId) {
      const connector = connectors.find(c => c.id === connectorId || c.name === connectorId);
      if (connector) {
        await connectAsync({ connector });
        return;
      }
    }
    // If no specific connector, try injected first (MetaMask)
    const injected = connectors.find(c => c.id === 'injected');
    if (injected) {
      await connectAsync({ connector: injected });
    }
  }, [connectors, connectAsync]);

  const disconnect = useCallback(async () => {
    await disconnectAsync();
  }, [disconnectAsync]);

  return {
    address: address ?? null,
    isConnected,
    chainId,
    connectors,
    isPending,
    openConnect,
    disconnect,
  };
};
