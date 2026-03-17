import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@/hooks/useWallet';
import { useActiveWallet } from '@/contexts/ActiveWalletContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, ArrowDownToLine, ArrowLeftRight, DollarSign, Eye, EyeOff, TrendingUp, Copy, Check, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import qrcode from 'qrcode-generator';
import { toast } from 'sonner';
import SendPanel from '@/components/home/SendPanel';
import BuyPanel from '@/components/home/BuyPanel';
import { useOnboarding } from '@/hooks/useOnboarding';
import { resolveAvatarUrl } from '@/utils/avatarResolver';

const Home = () => {
  const { balances, totalValue, loading, isConnected, priceError } = useWalletBalance();
  const { openConnect, address, authenticated, embeddedWallet, ready } = useWallet();
  const { profile } = useOnboarding();
  const navigate = useNavigate();
  const [hideBalance, setHideBalance] = useState(false);
  const [activePanel, setActivePanel] = useState<'send' | 'receive' | 'buy' | null>(null);
  const [copied, setCopied] = useState(false);

  // Web3Auth handles wallet creation automatically on connect

  const sortedBalances = [...balances].sort((a, b) => b.balanceUsd - a.balanceUsd);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  const qrSvg = useMemo(() => {
    if (!address) return '';
    const qr = qrcode(0, 'M');
    qr.addData(address);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [address]);

  return (
    <div className="min-h-[100dvh] bg-background relative">
      <div className="pt-[max(0.75rem,env(safe-area-inset-top))]" />

      <div className="px-4 pb-24 space-y-5">
        {!isConnected ? (
          <div className="mt-4">
            <div
              className="rounded-3xl p-6 text-center active:scale-[0.98] transition-transform cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #152012, #1A2917)' }}
              onClick={openConnect}
            >
              <Wallet className="w-12 h-12 text-primary mx-auto mb-3 opacity-60" />
              <h2 className="text-lg font-semibold text-foreground mb-1">Connect Your Wallet</h2>
              <p className="text-sm text-muted-foreground">Tap to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #152012, #1A2917)' }}
            >
              {/* Decorative circles */}
              <div
                className="absolute right-4 top-4 w-32 h-32 rounded-full opacity-40"
                style={{ background: 'radial-gradient(circle, #2d5a27 0%, transparent 70%)' }}
              />
              <div
                className="absolute right-16 top-8 w-24 h-24 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #1e4a1a 0%, transparent 70%)' }}
              />
              <div
                className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full opacity-25"
                style={{ background: 'radial-gradient(circle, #2d5a27 0%, transparent 70%)' }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-foreground/50 font-medium">Total Balance</p>
                  <button onClick={() => setHideBalance(!hideBalance)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform">
                    {hideBalance ? <EyeOff className="w-4 h-4 text-foreground/50" /> : <Eye className="w-4 h-4 text-foreground/50" />}
                  </button>
                </div>
                <p className="text-[2.25rem] font-bold text-foreground tabular-nums tracking-tight mb-3 leading-none">
                  {hideBalance ? '••••••' : `€${totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +0.00%
                  </span>
                  <span className="text-xs text-foreground/40">Last 24h</span>
                </div>
                {priceError && (
                  <p className="text-xs text-yellow-500 mt-1">⚠️ Prices may be inaccurate</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Send, label: 'Envoyer', action: () => setActivePanel('send') },
                { icon: ArrowDownToLine, label: 'Recevoir', action: () => setActivePanel('receive') },
                { icon: ArrowLeftRight, label: 'Échanger', action: () => navigate('/') },
                { icon: DollarSign, label: 'Acheter', action: () => setActivePanel('buy') },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-card border border-border/50 active:scale-95 active:bg-secondary transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/80 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>

            {/* My Assets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">My Assets</h3>
                <span className="text-xs text-muted-foreground">{sortedBalances.length} tokens</span>
              </div>
              {loading ? (
                <div className="space-y-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[60px] rounded-xl bg-card/50 animate-pulse" />
                  ))}
                </div>
              ) : sortedBalances.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm mb-1">No tokens found</p>
                  <p className="text-muted-foreground/60 text-xs">Buy or receive tokens to get started</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sortedBalances.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-card/60 active:bg-card/80 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {token.logoURI ? (
                          <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                            {token.symbol.slice(0, 3)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-foreground">{token.name}</p>
                          <p className="text-[11px] text-muted-foreground tabular-nums">
                            {token.balance} {token.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-foreground tabular-nums">
                          €{token.balanceUsd.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Send Panel */}
      {activePanel === 'send' && (
        <SendPanel onClose={() => setActivePanel(null)} address={address} />
      )}

      {/* Receive Panel */}
      {activePanel === 'receive' && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <h2 className="text-lg font-bold text-foreground">Receive</h2>
            <button onClick={() => setActivePanel(null)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
            <div
              className="w-48 h-48 rounded-2xl bg-white p-3 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="text-sm text-muted-foreground text-center">Scan to receive tokens</p>
            <div className="w-full rounded-2xl bg-card border border-border p-4 text-center">
              <p className="text-foreground font-mono text-sm break-all select-all">{address}</p>
            </div>
            <button
              onClick={copyAddress}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm active:scale-95 transition-transform"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
          </div>
        </div>
      )}

      {/* Buy Panel */}
      {activePanel === 'buy' && (
        <BuyPanel onClose={() => setActivePanel(null)} address={address} />
      )}
    </div>
  );
};

export default Home;
