import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@/hooks/useWallet';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, ArrowDownToLine, ArrowLeftRight, DollarSign, Eye, EyeOff, Copy, Check, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import qrcode from 'qrcode-generator';
import { toast } from 'sonner';
import SendPanel from '@/components/home/SendPanel';
import BuyPanel from '@/components/home/BuyPanel';
import { useOnboarding } from '@/hooks/useOnboarding';
import FloatingLeaves from '@/components/impact/FloatingLeaves';
import { useMarketData } from '@/hooks/useMarketData';
import SparklineChart from '@/components/SparklineChart';

const Home = () => {
  const { balances, totalValue, loading, isConnected, priceError } = useWalletBalance();
  const { openConnect, address, authenticated, embeddedWallet, ready } = useWallet();
  const { profile } = useOnboarding();
  const { tokens: marketTokens } = useMarketData();
  const navigate = useNavigate();
  const [hideBalance, setHideBalance] = useState(false);
  const [activePanel, setActivePanel] = useState<'send' | 'receive' | 'buy' | null>(null);
  const [copied, setCopied] = useState(false);

  const sparklineMap = useMemo(() => {
    const map: Record<string, { sparkline: number[]; change24h: number }> = {};
    for (const mt of marketTokens) {
      const sym = mt.symbol.toUpperCase();
      if (mt.sparkline_in_7d?.price && mt.sparkline_in_7d.price.length > 0) {
        map[sym] = { sparkline: mt.sparkline_in_7d.price, change24h: mt.price_change_percentage_24h };
      }
    }
    return map;
  }, [marketTokens]);

  // Compute total 24h change weighted by portfolio
  const portfolio24hChange = useMemo(() => {
    if (totalValue === 0) return 0;
    let weightedChange = 0;
    for (const token of balances) {
      const data = sparklineMap[token.symbol.toUpperCase()];
      if (data) {
        weightedChange += (data.change24h / 100) * token.balanceUsd;
      }
    }
    return (weightedChange / totalValue) * 100;
  }, [balances, sparklineMap, totalValue]);

  useEffect(() => {
    if (ready && authenticated && !embeddedWallet) {
      openConnect();
    }
  }, [ready, authenticated, embeddedWallet, openConnect]);

  const sortedBalances = [...balances].sort((a, b) => b.balanceUsd - a.balanceUsd);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qrSvg = useMemo(() => {
    if (!address) return '';
    const qr = qrcode(0, 'M');
    qr.addData(address);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [address]);

  const isPositivePortfolio = portfolio24hChange >= 0;
  const changeAmount = Math.abs((portfolio24hChange / 100) * totalValue);

  const quickActions = [
    { icon: Send, label: 'Envoyer', action: () => setActivePanel('send') },
    { icon: ArrowDownToLine, label: 'Recevoir', action: () => setActivePanel('receive') },
    { icon: ArrowLeftRight, label: 'Échanger', action: () => navigate('/') },
    { icon: DollarSign, label: 'Acheter', action: () => navigate('/?mode=buy') },
  ];

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      <FloatingLeaves />
      <div className="pt-[max(0.5rem,env(safe-area-inset-top))]" />

      <div className="px-4 pb-24 space-y-4 relative z-10">
        {!isConnected ? (
          <div className="mt-4">
            <div
              className="rounded-3xl p-6 text-center active:scale-[0.98] transition-transform cursor-pointer border border-border/50"
              style={{ background: 'linear-gradient(135deg, hsl(0 0% 4%), hsl(0 0% 6%))' }}
              onClick={openConnect}
            >
              <Wallet className="w-12 h-12 text-primary mx-auto mb-3 opacity-60" />
              <h2 className="text-lg font-semibold text-foreground mb-1">Connect Your Wallet</h2>
              <p className="text-sm text-muted-foreground">Tap to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Balance Card ── */}
            <div className="rounded-[1.25rem] relative overflow-hidden border border-primary/10"
              style={{ background: 'linear-gradient(160deg, hsl(142 40% 8%), hsl(0 0% 3%) 60%, hsl(142 30% 6%))' }}>
              {/* Glow accent */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-40 blur-3xl"
                style={{ background: 'hsl(142 76% 52% / 0.2)' }} />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-25 blur-2xl"
                style={{ background: 'hsl(162 72% 48% / 0.15)' }} />

              <div className="relative z-10 px-5 pt-4 pb-4">
                {/* Top row: label + eye */}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-muted-foreground font-medium tracking-widest uppercase">
                    Solde total
                  </p>
                  <button
                    onClick={() => setHideBalance(!hideBalance)}
                    className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                  >
                    {hideBalance
                      ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      : <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </button>
                </div>

                {/* Balance amount */}
                <p className="text-[2.75rem] font-bold text-foreground tabular-nums tracking-tight leading-none mb-1">
                  {hideBalance ? '••••••' : `€${totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>

                {/* 24h change pill */}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    isPositivePortfolio
                      ? 'bg-primary/15 text-primary'
                      : 'bg-destructive/15 text-destructive'
                  }`}>
                    {isPositivePortfolio ? '↑' : '↓'}
                    {hideBalance ? '••' : `€${changeAmount.toFixed(2)}`}
                    <span className="opacity-70">
                      ({isPositivePortfolio ? '+' : ''}{portfolio24hChange.toFixed(2)}%)
                    </span>
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">24h</span>
                </div>

                {priceError && (
                  <p className="text-[10px] text-yellow-500/80 mt-1.5">⚠️ Prix approximatifs</p>
                )}

                {/* Inline Quick Actions */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {quickActions.map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      className="flex flex-col items-center gap-1.5 py-2 rounded-xl active:scale-95 transition-all hover:bg-foreground/5"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="w-[17px] h-[17px] text-primary" />
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── My Assets ── */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-sm font-semibold text-foreground">Mes actifs</h3>
                <span className="text-[11px] text-muted-foreground">{sortedBalances.length} tokens</span>
              </div>

              {loading ? (
                <div className="space-y-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[60px] rounded-2xl bg-card animate-pulse" />
                  ))}
                </div>
              ) : sortedBalances.length === 0 ? (
                <div className="text-center py-10 rounded-2xl bg-card/30 border border-border/30">
                  <p className="text-muted-foreground text-sm mb-1">Aucun token trouvé</p>
                  <p className="text-muted-foreground/50 text-[11px]">Achetez ou recevez des tokens</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sortedBalances.map((token) => {
                    const sparkData = sparklineMap[token.symbol.toUpperCase()];
                    const change24h = sparkData?.change24h ?? 0;
                    const isPositive = change24h >= 0;
                    return (
                      <div
                        key={token.symbol}
                        className="flex items-center justify-between px-3 py-3 rounded-2xl bg-card/40 border border-border/20 active:bg-card/70 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {token.logoURI ? (
                            <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full bg-secondary/50 flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                              {token.symbol.slice(0, 3)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-[13px] text-foreground truncate">{token.name}</p>
                            <p className="text-[11px] text-muted-foreground tabular-nums">
                              {token.balance} {token.symbol}
                            </p>
                          </div>
                        </div>
                        {/* Mini sparkline */}
                        <div className="flex-shrink-0 mx-2">
                          {sparkData?.sparkline ? (
                            <SparklineChart
                              data={sparkData.sparkline.slice(-24)}
                              width={52}
                              height={22}
                              isPositive={isPositive}
                            />
                          ) : (
                            <div className="w-[52px] h-[22px]" />
                          )}
                        </div>
                        <div className="text-right flex-shrink-0 min-w-[64px]">
                          <p className="font-semibold text-[13px] text-foreground tabular-nums">
                            €{token.balanceUsd.toFixed(2)}
                          </p>
                          <p className={`text-[10px] tabular-nums font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
            <h2 className="text-lg font-bold text-foreground">Recevoir</h2>
            <button onClick={() => setActivePanel(null)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
            <div
              className="w-48 h-48 rounded-2xl bg-white p-3 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="text-sm text-muted-foreground text-center">Scannez pour recevoir des tokens</p>
            <div className="w-full rounded-2xl bg-card border border-border p-4 text-center">
              <p className="text-foreground font-mono text-sm break-all select-all">{address}</p>
            </div>
            <button
              onClick={copyAddress}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm active:scale-95 transition-transform"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copié !' : 'Copier l\'adresse'}
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
