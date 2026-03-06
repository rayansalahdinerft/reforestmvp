import { useState, useEffect } from 'react';
import { useActiveWallet } from '@/contexts/ActiveWalletContext';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, Check, Wallet, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface WalletBalanceCache {
  [address: string]: { total: number; loading: boolean };
}

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const PRIVATE_KEY_REGEX = /^0x[a-fA-F0-9]{64}$/;

const WalletSwitcher = () => {
  const { wallets, activeAddress, switchWallet, refreshWallets, profileId } = useActiveWallet();
  const { address: connectedAddress } = useWallet();
  const [open, setOpen] = useState(false);
  const [balances, setBalances] = useState<WalletBalanceCache>({});

  useEffect(() => {
    if (wallets.length === 0) return;

    wallets.forEach(async (w) => {
      if (balances[w.wallet_address]?.total !== undefined && !balances[w.wallet_address]?.loading) return;

      setBalances(prev => ({ ...prev, [w.wallet_address]: { total: 0, loading: true } }));

      try {
        const res = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${w.wallet_address}&tag=latest`);
        const data = await res.json();
        if (data.status === '1') {
          const ethBalance = parseFloat(data.result) / 1e18;
          let ethPrice = 0;
          try {
            const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const priceData = await priceRes.json();
            ethPrice = priceData.ethereum?.usd || 0;
          } catch {
            ethPrice = 0;
          }

          setBalances(prev => ({
            ...prev,
            [w.wallet_address]: { total: ethBalance * ethPrice, loading: false }
          }));
        } else {
          setBalances(prev => ({ ...prev, [w.wallet_address]: { total: 0, loading: false } }));
        }
      } catch {
        setBalances(prev => ({ ...prev, [w.wallet_address]: { total: 0, loading: false } }));
      }
    });
  }, [wallets, balances]);

  const formatAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const formatUsd = (val: number) => {
    if (val === 0) return '$0.00';
    if (val < 0.01) return '<$0.01';
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (!connectedAddress || wallets.length === 0) return null;

  const currentWallet = wallets.find(w => w.wallet_address === activeAddress);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-all text-sm"
      >
        <Wallet className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium text-foreground truncate max-w-[100px]">
          {currentWallet?.wallet_name || 'Wallet'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-card border border-border shadow-xl z-50 overflow-hidden">
            <div className="p-2 space-y-1 max-h-[50vh] overflow-y-auto">
              <p className="text-xs text-muted-foreground px-3 py-1.5 font-medium">My Wallets</p>
              {wallets.map((w) => {
                const isActive = w.wallet_address === activeAddress;
                const bal = balances[w.wallet_address];
                return (
                  <button
                    key={w.id}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-secondary border border-transparent'
                    }`}
                    onClick={() => {
                      switchWallet(w.wallet_address);
                      setOpen(false);
                    }}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-primary/20' : 'bg-secondary'
                    }`}>
                      <Wallet className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{w.wallet_name}</p>
                        {w.is_primary && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium flex-shrink-0">Main</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-muted-foreground font-mono">{formatAddr(w.wallet_address)}</p>
                        <span className="text-xs font-medium text-foreground">
                          {bal?.loading ? (
                            <Loader2 className="w-3 h-3 animate-spin inline" />
                          ) : (
                            formatUsd(bal?.total ?? 0)
                          )}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-border p-2 space-y-1">
              <button
                onClick={() => {
                  setOpen(false);
                  // Open Dynamic widget to create/add a new wallet
                  const dynamicBtn = document.querySelector('[data-testid="dynamic-widget"]') as HTMLElement;
                  if (dynamicBtn) dynamicBtn.click();
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-secondary transition-all text-left text-sm text-primary font-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                Create a new wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletSwitcher;
