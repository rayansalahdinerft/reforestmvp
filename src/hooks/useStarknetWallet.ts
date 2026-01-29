import { useState, useCallback, useEffect } from 'react';

export type StarknetWalletType = 'argentX' | 'braavos' | null;

interface StarknetWallet {
  id: string;
  name: string;
  icon: string;
  isInstalled: boolean;
  provider: any;
}

interface StarknetWalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletType: StarknetWalletType;
  chainId: string | null;
}

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Detect installed Starknet wallets
const getStarknetWallets = (): StarknetWallet[] => {
  if (!isBrowser) return [];
  
  const wallets: StarknetWallet[] = [];
  
  // ArgentX
  if ((window as any).starknet_argentX) {
    wallets.push({
      id: 'argentX',
      name: 'Argent X',
      icon: 'https://www.argent.xyz/favicon.ico',
      isInstalled: true,
      provider: (window as any).starknet_argentX,
    });
  }
  
  // Braavos
  if ((window as any).starknet_braavos) {
    wallets.push({
      id: 'braavos',
      name: 'Braavos',
      icon: 'https://braavos.app/favicon.ico',
      isInstalled: true,
      provider: (window as any).starknet_braavos,
    });
  }
  
  // Fallback to generic starknet object
  if (wallets.length === 0 && (window as any).starknet) {
    wallets.push({
      id: 'default',
      name: 'Starknet Wallet',
      icon: 'https://starknet.io/favicon.ico',
      isInstalled: true,
      provider: (window as any).starknet,
    });
  }
  
  return wallets;
};

export const useStarknetWallet = () => {
  const [state, setState] = useState<StarknetWalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    walletType: null,
    chainId: null,
  });
  
  const [availableWallets, setAvailableWallets] = useState<StarknetWallet[]>([]);
  const [activeProvider, setActiveProvider] = useState<any>(null);

  // Detect wallets on mount
  useEffect(() => {
    const detectWallets = () => {
      const wallets = getStarknetWallets();
      setAvailableWallets(wallets);
    };
    
    // Check immediately and after a delay (wallets may inject late)
    detectWallets();
    const timeout = setTimeout(detectWallets, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Check for existing connection
  useEffect(() => {
    const checkConnection = async () => {
      for (const wallet of availableWallets) {
        if (wallet.provider?.isConnected) {
          try {
            const accounts = await wallet.provider.request({ type: 'wallet_requestAccounts' });
            if (accounts && accounts.length > 0) {
              setState({
                address: accounts[0],
                isConnected: true,
                isConnecting: false,
                walletType: wallet.id as StarknetWalletType,
                chainId: wallet.provider.chainId || 'SN_MAIN',
              });
              setActiveProvider(wallet.provider);
              break;
            }
          } catch (e) {
            console.log('Not connected to', wallet.name);
          }
        }
      }
    };
    
    if (availableWallets.length > 0) {
      checkConnection();
    }
  }, [availableWallets]);

  const connect = useCallback(async (walletId?: string) => {
    const targetWallet = walletId 
      ? availableWallets.find(w => w.id === walletId)
      : availableWallets[0];
    
    if (!targetWallet) {
      throw new Error('No Starknet wallet found. Please install ArgentX or Braavos.');
    }

    setState(prev => ({ ...prev, isConnecting: true }));

    try {
      // Enable the wallet
      const accounts = await targetWallet.provider.request({ 
        type: 'wallet_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const chainId = targetWallet.provider.chainId || 'SN_MAIN';
      
      setState({
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        walletType: targetWallet.id as StarknetWalletType,
        chainId,
      });
      
      setActiveProvider(targetWallet.provider);

      // Listen for account changes
      targetWallet.provider.on?.('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setState(prev => ({ ...prev, address: accounts[0] }));
        }
      });

      // Listen for network changes
      targetWallet.provider.on?.('networkChanged', (chainId: string) => {
        setState(prev => ({ ...prev, chainId }));
      });

      return accounts[0];
    } catch (error) {
      setState(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, [availableWallets]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isConnecting: false,
      walletType: null,
      chainId: null,
    });
    setActiveProvider(null);
  }, []);

  const signAndExecute = useCallback(async (calls: any[]) => {
    if (!activeProvider || !state.address) {
      throw new Error('Wallet not connected');
    }

    try {
      // Execute transactions
      const result = await activeProvider.request({
        type: 'wallet_addInvokeTransaction',
        params: {
          calls: calls.map(call => ({
            contract_address: call.contractAddress,
            entry_point: call.entrypoint,
            calldata: call.calldata,
          })),
        },
      });

      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }, [activeProvider, state.address]);

  return {
    ...state,
    availableWallets,
    connect,
    disconnect,
    signAndExecute,
    provider: activeProvider,
  };
};
