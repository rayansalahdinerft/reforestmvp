import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@/hooks/useWallet';
import { useActiveWallet } from '@/contexts/ActiveWalletContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, ArrowDownToLine, ArrowLeftRight, DollarSign, Eye, EyeOff, TrendingUp, Copy, Check, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import qrcode from 'qrcode-generator';
import { toast } from 'sonner';
import SendPanel from '@/components/home/SendPanel';
import BuyPanel from '@/components/home/BuyPanel';
import { useOnboarding } from '@/hooks/useOnboarding';

const Home = () => {
  const { balances, totalValue, loading, isConnected, priceError } = useWalletBalance();
  const { openConnect, address } = useWallet();
  const { profile } = useOnboarding();
  const navigate = useNavigate();
  const [hideBalance, setHideBalance] = useState(false);
  const [activePanel, setActivePanel] = useState<'send' | 'receive' | 'buy' | null>(null);
  const [copied, setCopied] = useState(false);

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
      {/* Top spacing */}
      <div className="pt-[max(0.75rem,env(safe-area-inset-top))]" />

      <div className="px-4 pb-4 space-y-5">
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
              className="rounded-3xl p-5 relative overflow-hidden mt-2"
              style={{ background: 'linear-gradient(145deg, #152012, #1A2917)' }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-60"
                style={{ background: 'radial-gradient(circle, #1e3a1a 0%, #152012 60%, transparent 100%)' }}
              />
              <div
                className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full opacity-50"
                style={{ background: 'radial-gradient(circle, #1e3a1a 0%, #1A2917 60%, transparent 100%)' }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-primary/70 font-medium">Total Balance</p>
                  <button onClick={() => setHideBalance(!hideBalance)} className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center active:scale-90 transition-transform">
                    {hideBalance ? <EyeOff className="w-4 h-4 text-foreground/60" /> : <Eye className="w-4 h-4 text-foreground/60" />}
                  </button>
                </div>
                <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight mb-3">
                  {hideBalance ? '••••••' : `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +0.00%
                  </span>
                  <span className="text-xs text-foreground/50">Last 24h</span>
                </div>
                {priceError && (
                  <p className="text-xs text-yellow-500 mt-1">⚠️ Prices may be inaccurate</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2.5">
              <button
                onClick={() => setActivePanel('send')}
                className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-card border border-border active:scale-95 active:bg-secondary transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Send className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Send</span>
              </button>
              <button
                onClick={() => setActivePanel('receive')}
                className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-card border border-border active:scale-95 active:bg-secondary transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                  <ArrowDownToLine className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Receive</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-card border border-border active:scale-95 active:bg-secondary transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                  <ArrowLeftRight className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Swap</span>
              </button>
              <button
                onClick={() => setActivePanel('buy')}
                className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-card border border-border active:scale-95 active:bg-secondary transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Buy</span>
              </button>
            </div>

            {/* My Assets */}
            <div>
              <h3 className="text-base font-semibold text-primary mb-3">My Assets</h3>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-[72px] rounded-2xl bg-card border border-border animate-pulse" />
                  ))}
                </div>
              ) : sortedBalances.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No tokens found</p>
              ) : (
                <div className="space-y-2">
                  {sortedBalances.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-card border border-border active:bg-secondary transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {token.logoURI ? (
                          <img src={token.logoURI} alt={token.symbol} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                            {token.symbol.slice(0, 3)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-foreground">{token.symbol}</p>
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {token.balance} {token.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-foreground tabular-nums">
                          ${token.balanceUsd.toFixed(2)}
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
