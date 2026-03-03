import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, Plus, Check, Wallet } from 'lucide-react';

interface WalletEntry {
  id: string;
  wallet_address: string;
  wallet_name: string;
  wallet_type: string;
  chain: string;
  is_primary: boolean;
}

const WalletSwitcher = () => {
  const { wallets: dynamicWallets, activeWallet, address } = useWallet();
  const { profile } = useOnboarding();
  const [dbWallets, setDbWallets] = useState<WalletEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    const fetchWallets = async () => {
      const { data } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('profile_id', profile.id)
        .order('is_primary', { ascending: false });
      if (data) setDbWallets(data as WalletEntry[]);
    };
    fetchWallets();
  }, [profile?.id]);

  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!address || dbWallets.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-all text-sm"
      >
        <Wallet className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium text-foreground">
          {dbWallets.find(w => w.wallet_address === address)?.wallet_name || 'Wallet'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-card border border-border shadow-xl z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              <p className="text-xs text-muted-foreground px-3 py-1.5 font-medium">Mes Wallets</p>
              {dbWallets.map((w) => (
                <button
                  key={w.id}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    w.wallet_address === address
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    w.wallet_address === address ? 'bg-primary/20' : 'bg-secondary'
                  }`}>
                    <Wallet className={`w-4 h-4 ${w.wallet_address === address ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{w.wallet_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{formatAddr(w.wallet_address)}</p>
                  </div>
                  {w.wallet_address === address && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-secondary transition-all text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                  // Future: open create wallet flow
                }}
              >
                <Plus className="w-4 h-4" />
                Créer un nouveau wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletSwitcher;
