import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@/hooks/useWallet';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, ArrowDownToLine, ArrowLeftRight, DollarSign, Eye, EyeOff, TrendingUp, Copy, Check, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import qrcode from 'qrcode-generator';
import { toast } from 'sonner';
import SendPanel from '@/components/home/SendPanel';
import BuyPanel from '@/components/home/BuyPanel';
import { useOnboarding } from '@/hooks/useOnboarding';
import FloatingLeaves from '@/components/impact/FloatingLeaves';
import { useMarketData } from '@/hooks/useMarketData';
import SparklineChart from '@/components/SparklineChart';
import BalanceMascot from '@/components/home/BalanceMascot';

const Home = () => {
  const { balances, totalValue, loading, isConnected, priceError } = useWalletBalance();
  const { openConnect, address, authenticated, embeddedWallet, ready } = useWallet();
  const { profile } = useOnboarding();
  const { tokens: marketTokens } = useMarketData();
  const navigate = useNavigate();
  const [hideBalance, setHideBalance] = useState(false);
  const [activePanel, setActivePanel] = useState<'send' | 'receive' | 'buy' | null>(null);
  const [copied, setCopied] = useState(false);
  

  // Build a map of symbol -> sparkline data & 24h change from market data
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

  const toggleBalance = () => {
    setHideBalance((prev) => !prev);
  };


  const qrSvg = useMemo(() => {
    if (!address) return '';
    const qr = qrcode(0, 'M');
    qr.addData(address);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [address]);

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      <FloatingLeaves />
      <div className="pt-[max(0.75rem,env(safe-area-inset-top))]" />

      <div className="px-4 pb-24 space-y-5 relative z-10">
        {!isConnected ? (
          <div className="mt-4">
            <div
              className="rounded-3xl p-8 text-center active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0F2B0A, #1A3D14 50%, #225A1E)' }}
              onClick={openConnect}
            >
              <img src={mascot} alt="ReforestWallet mascot" className="w-28 h-28 mx-auto mb-4 drop-shadow-xl animate-bounce-slow" style={{ filter: 'drop-shadow(0 8px 20px hsl(145 85% 55% / 0.3))' }} />
              <h2 className="text-xl font-bold text-foreground mb-1">Welcome to ReforestWallet</h2>
              <p className="text-sm text-muted-foreground mb-4">Connect your wallet to get started</p>
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                <Wallet className="w-4 h-4" />
                Get Started
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div className="rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0F2B0A, #1A3D14 40%, #225A1E)' }}>
              {/* Vivid organic shapes */}
              <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, hsl(145 85% 55% / 0.3), transparent 70%)' }} />
              <div className="absolute right-16 top-12 w-28 h-28 rounded-full opacity-25" style={{ background: 'radial-gradient(circle, hsl(160 80% 50% / 0.35), transparent 70%)' }} />
              
              {/* Mascot - single image, CSS animated */}
              <div 
                className={`absolute pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 ${
                  mascotState === 'guarding' 
                    ? 'w-[100px] h-[100px] left-1/2 -translate-x-1/2 bottom-6' 
                    : mascotState === 'walking'
                    ? 'w-[90px] h-[90px] left-1/2 -translate-x-1/2 -bottom-1'
                    : 'w-[80px] h-[80px] -right-1 -bottom-1'
                }`}
                style={{ filter: 'drop-shadow(0 6px 20px hsl(145 85% 55% / 0.3))' }}
              >
                <img
                  src={mascot}
                  alt="Mascot"
                  className={`w-full h-full object-contain transition-transform duration-1000 ease-in-out ${
                    mascotState === 'guarding' 
                      ? 'animate-guard' 
                      : mascotState === 'walking'
                      ? 'animate-waddle'
                      : 'animate-roam'
                  }`}
                />
              </div>

              {/* Speech bubble */}
              <div className={`absolute left-1/2 -translate-x-1/2 bottom-[110px] z-30 transition-all duration-500 pointer-events-none ${showBubble ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-75'}`}>
                <div className="relative bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl px-3 py-1.5 shadow-lg">
                  <p className="text-[10px] font-medium text-foreground whitespace-nowrap">{bubbleText}</p>
                  {/* Bubble tail */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-card/95 border-b border-r border-border/50 rotate-45" />
                </div>
              </div>
              
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30" style={{ background: 'linear-gradient(90deg, transparent, hsl(145 85% 55% / 0.6), transparent)' }} />

              <div className="relative z-10 px-5 pt-5 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-foreground/40 font-medium tracking-wider uppercase">Total Balance</p>
                  <button onClick={toggleBalance} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform bg-foreground/5">
                    {hideBalance ? <EyeOff className="w-3.5 h-3.5 text-foreground/40" /> : <Eye className="w-3.5 h-3.5 text-foreground/40" />}
                  </button>
                </div>
                <p className="text-[2.5rem] font-bold text-foreground tabular-nums tracking-tight mb-4 leading-none">
                  {hideBalance ? '••••••' : `€${totalValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +0.00%
                  </span>
                  <span className="text-[10px] text-foreground/30">Last 24h</span>
                </div>
                {priceError && (
                  <p className="text-xs text-yellow-500 mt-2">⚠️ Prices may be inaccurate</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { icon: Send, label: 'Envoyer', action: () => setActivePanel('send') },
                { icon: ArrowDownToLine, label: 'Recevoir', action: () => setActivePanel('receive') },
                { icon: ArrowLeftRight, label: 'Échanger', action: () => navigate('/') },
                { icon: DollarSign, label: 'Acheter', action: () => navigate('/?mode=buy') },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-card border border-border/40 active:scale-95 active:bg-secondary transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary/80 flex items-center justify-center">
                    <Icon className="w-[18px] h-[18px] text-foreground" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>

            {/* My Assets */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">My Assets</h3>
                <span className="text-xs text-primary/60">{sortedBalances.length} tokens</span>
              </div>
              {loading ? (
                <div className="space-y-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-[56px] rounded-xl bg-card/50 animate-pulse" />
                  ))}
                </div>
              ) : sortedBalances.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground text-sm mb-1">No tokens found</p>
                  <p className="text-muted-foreground/60 text-xs">Buy or receive tokens to get started</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {sortedBalances.map((token) => {
                    const sparkData = sparklineMap[token.symbol.toUpperCase()];
                    const change24h = sparkData?.change24h ?? 0;
                    const isPositive = change24h >= 0;
                    return (
                      <div
                        key={token.symbol}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-card/60 active:bg-card/80 transition-all"
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
                            <p className="font-semibold text-sm text-foreground truncate">{token.name}</p>
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
                              width={56}
                              height={24}
                              isPositive={isPositive}
                            />
                          ) : (
                            <div className="w-[56px] h-[24px]" />
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-sm text-foreground tabular-nums">
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
