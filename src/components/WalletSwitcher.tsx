import { useState, useEffect } from 'react';
import { useActiveWallet } from '@/contexts/ActiveWalletContext';
import { useWallet } from '@/hooks/useWallet';
import { useEmbeddedWallet } from '@dynamic-labs/sdk-react-core';
import { supabase } from '@/integrations/supabase/client';
import { privateKeyToAddress } from 'viem/accounts';
import { ChevronDown, Plus, Check, Wallet, Loader2, Download, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

interface WalletBalanceCache {
  [address: string]: { total: number; loading: boolean };
}

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
const PRIVATE_KEY_REGEX = /^0x[a-fA-F0-9]{64}$/;

const WalletSwitcher = () => {
  const { wallets, activeAddress, switchWallet, refreshWallets, profileId } = useActiveWallet();
  const { address: connectedAddress, wallets: dynamicWallets } = useWallet();
  const { createEmbeddedWallet, userHasEmbeddedWallet } = useEmbeddedWallet();
  const [open, setOpen] = useState(false);
  const [balances, setBalances] = useState<WalletBalanceCache>({});
  const [creating, setCreating] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importPrivateKey, setImportPrivateKey] = useState('');
  const [importing, setImporting] = useState(false);

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

  const registerWallet = async (
    address: string,
    type: 'mpc' | 'imported',
    options?: { importMethod?: 'private_key' | 'address' }
  ) => {
    const normalizedAddress = address.toLowerCase();

    try {
      const { data, error } = await supabase.functions.invoke('create-wallet', {
        body: {
          profileId,
          walletAddress: normalizedAddress,
          chain: 'ethereum',
          walletType: type,
          importMethod: options?.importMethod,
        },
      });

      if (error) throw new Error(error.message || 'Failed to register wallet');
      if (data?.error) throw new Error(data.error);
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const handleCreateWallet = async () => {
    if (!profileId) {
      toast.error('Profile not found. Complete onboarding first.');
      return;
    }

    setCreating(true);
    try {
      const alreadyRegistered = new Set(wallets.map(w => w.wallet_address.toLowerCase()));

      if (userHasEmbeddedWallet) {
        const existingDynamicAddress =
          dynamicWallets.find((w: any) => w?.address && !alreadyRegistered.has(String(w.address).toLowerCase()))?.address ||
          connectedAddress;

        if (!existingDynamicAddress) {
          toast.info('Your embedded wallet is already linked.');
          return;
        }

        await registerWallet(existingDynamicAddress, 'mpc');
        toast.success('Wallet linked successfully! 🌱');
        await refreshWallets();
        return;
      }

      const newWallet = await createEmbeddedWallet();
      const address =
        (newWallet as any)?.address ||
        connectedAddress ||
        dynamicWallets.find((w: any) => w?.address)?.address ||
        null;

      if (!address) {
        toast.error('Wallet created but no address returned. Please retry.');
        return;
      }

      await registerWallet(address, 'mpc');
      toast.success('New ReforestWallet created! 🌱');
      await refreshWallets();
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('already')) {
        toast.error('This wallet is already registered.');
      } else {
        toast.error(msg || 'Failed to create wallet');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleImportWallet = async () => {
    if (!profileId) {
      toast.error('Profile not found. Complete onboarding first.');
      return;
    }

    const raw = importPrivateKey.trim();
    if (!raw) {
      toast.error('Enter your private key.');
      return;
    }

    const normalizedKey = raw.startsWith('0x') ? raw : `0x${raw}`;
    if (!PRIVATE_KEY_REGEX.test(normalizedKey)) {
      toast.error('Invalid private key format. Expected 64 hex characters.');
      return;
    }

    setImporting(true);
    try {
      const derivedAddress = privateKeyToAddress(normalizedKey as `0x${string}`).toLowerCase();

      if (!ETH_ADDRESS_REGEX.test(derivedAddress)) {
        toast.error('Unable to derive a valid Ethereum address from this key.');
        return;
      }

      if (wallets.some(w => w.wallet_address.toLowerCase() === derivedAddress)) {
        toast.error('This wallet is already in your list.');
        return;
      }

      await registerWallet(derivedAddress, 'imported', { importMethod: 'private_key' });
      toast.success('Wallet imported from private key! 🌱');
      setImportPrivateKey('');
      setShowImport(false);
      await refreshWallets();
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('already registered')) {
        toast.error('This wallet address is already registered.');
      } else {
        toast.error(msg || 'Failed to import wallet');
      }
    } finally {
      setImporting(false);
    }
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
        <span className="font-medium text-foreground truncate max-w-[100px]">
          {currentWallet?.wallet_name || 'Wallet'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setShowImport(false); }} />
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

            <div className="border-t border-border p-2">
              <p className="text-[10px] text-muted-foreground px-3 py-1">
                Manage wallets via your Dynamic account settings.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletSwitcher;
