import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';

interface WalletEntry {
  id: string;
  wallet_address: string;
  wallet_name: string;
  wallet_type: string;
  chain: string;
  is_primary: boolean;
}

interface ActiveWalletContextType {
  /** The currently selected wallet address (overridable by user) */
  activeAddress: string | null;
  /** All wallets for this profile */
  wallets: WalletEntry[];
  /** Switch active wallet */
  switchWallet: (address: string) => void;
  /** Refresh wallet list from DB */
  refreshWallets: () => Promise<void>;
  /** Loading state */
  loading: boolean;
  /** Profile ID */
  profileId: string | null;
}

const ActiveWalletContext = createContext<ActiveWalletContextType>({
  activeAddress: null,
  wallets: [],
  switchWallet: () => {},
  refreshWallets: async () => {},
  loading: true,
  profileId: null,
});

export const useActiveWallet = () => useContext(ActiveWalletContext);

export const ActiveWalletProvider = ({ children }: { children: ReactNode }) => {
  const { address: connectedAddress, isConnected } = useWallet();
  const { profile } = useOnboarding();
  const [wallets, setWallets] = useState<WalletEntry[]>([]);
  const [activeAddress, setActiveAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const profileId = profile?.id ?? null;

  const fetchWallets = useCallback(async () => {
    if (!profileId) {
      setWallets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('profile_id', profileId)
      .order('is_primary', { ascending: false });
    
    if (data) {
      setWallets(data as WalletEntry[]);
      // If no active address set yet, pick primary or connected
      if (!activeAddress || !data.find(w => w.wallet_address === activeAddress)) {
        const primary = data.find(w => w.is_primary);
        setActiveAddress(primary?.wallet_address ?? connectedAddress);
      }
    }
    setLoading(false);
  }, [profileId, connectedAddress]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // When connected address changes and we have no wallets yet, use it
  useEffect(() => {
    if (connectedAddress && !activeAddress) {
      setActiveAddress(connectedAddress);
    }
  }, [connectedAddress]);

  const switchWallet = (address: string) => {
    setActiveAddress(address);
  };

  return (
    <ActiveWalletContext.Provider
      value={{
        activeAddress: isConnected ? activeAddress : null,
        wallets,
        switchWallet,
        refreshWallets: fetchWallets,
        loading,
        profileId,
      }}
    >
      {children}
    </ActiveWalletContext.Provider>
  );
};
