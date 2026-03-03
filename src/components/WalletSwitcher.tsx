import { useState, useEffect } from 'react';
import { useActiveWallet } from '@/contexts/ActiveWalletContext';
import { useWallet } from '@/hooks/useWallet';
import { useEmbeddedWallet } from '@dynamic-labs/sdk-react-core';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, Plus, Check, Wallet, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface WalletBalanceCache {
  [address: string]: { total: number; loading: boolean };
}

const WalletSwitcher = () => {
  const { wallets, activeAddress, switchWallet, refreshWallets, profileId } = useActiveWallet();
  const { address: connectedAddress } = useWallet();
  const { createEmbeddedWallet } = useEmbeddedWallet();
  const [open, setOpen] = useState(false);
  const [balances, setBalances] = useState<WalletBalanceCache>({});
  const [creating, setCreating] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importAddress, setImportAddress] = useState('');
  const [importing, setImporting] = useState(false);

  // Fetch simple ETH balance for each wallet
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
          } catch { ethPrice = 0; }
          
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
  }, [wallets]);

  const registerWallet = async (address: string, type: string) => {
    const { data, error } = await supabase.functions.invoke('create-wallet', {
      body: {
        profileId,
        walletAddress: address,
        chain: 'ethereum',
        walletType: type,
      },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const handleCreateWallet = async () => {
    if (!profileId) {
      toast.error('Profile not found');
      return;
    }

    setCreating(true);
    try {
      // Create a new embedded MPC wallet via Dynamic SDK
      const newWallet = await createEmbeddedWallet();
      
      if (!newWallet?.address) {
        toast.error('Failed to create wallet. Please try again.');
        setCreating(false);
        return;
      }

      await registerWallet(newWallet.address, 'mpc');
      toast.success('New ReforestWallet created! 🌱');
      await refreshWallets();
    } catch (err: any) {
      console.error('Create wallet error:', err);
      toast.error(err?.message || 'Failed to create wallet');
    }
    setCreating(false);
  };

  const handleImportWallet = async () => {
    const addr = importAddress.trim();
    if (!profileId) {
      toast.error('Profile not found');
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      toast.error('Invalid Ethereum address');
      return;
    }

    setImporting(true);
    try {
      await registerWallet(addr, 'imported');
      toast.success('Wallet imported! 🌱');
      setImportAddress('');
      setShowImport(false);
      await refreshWallets();
    } catch (err: any) {
      console.error('Import wallet error:', err);
      toast.error(err?.message || 'Failed to import wallet');
    }
    setImporting(false);
  };

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
        <span className="font-medium text-foreground">
          {currentWallet?.wallet_name || 'Wallet'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setShowImport(false); }} />
          <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-card border border-border shadow-xl z-50 overflow-hidden">
            <div className="p-2 space-y-1">
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
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-primary/20' : 'bg-secondary'
                    }`}>
                      <Wallet className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{w.wallet_name}</p>
                        {w.is_primary && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">Main</span>
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

            {/* Import wallet inline form */}
            {showImport && (
              <div className="px-3 pb-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={importAddress}
                    onChange={(e) => setImportAddress(e.target.value)}
                    placeholder="0x... ETH address"
                    className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleImportWallet}
                    disabled={importing}
                    className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                  >
                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-border p-2 space-y-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-secondary transition-all text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                onClick={handleCreateWallet}
                disabled={creating}
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create new ReforestWallet
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-secondary transition-all text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setShowImport(!showImport)}
              >
                <Download className="w-4 h-4" />
                Import wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletSwitcher;
