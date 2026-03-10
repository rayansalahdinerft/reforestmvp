import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@/hooks/useWallet';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, ArrowDownToLine, ArrowLeftRight, DollarSign, Search, Settings, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import Logo from '@/components/Logo';
import { useState } from 'react';

const Home = () => {
  const { balances, totalValue, loading, isConnected, priceError } = useWalletBalance();
  const { openConnect } = useWallet();
  const navigate = useNavigate();
  const [hideBalance, setHideBalance] = useState(false);
  const [search, setSearch] = useState('');

  const quickActions = [
    { icon: Send, label: 'Send', action: () => navigate('/') },
    { icon: ArrowDownToLine, label: 'Receive', action: () => {} },
    { icon: ArrowLeftRight, label: 'Swap', action: () => navigate('/') },
    { icon: DollarSign, label: 'Buy', action: () => navigate('/') },
  ];

  const filteredBalances = balances
    .filter(t => !search || t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.balanceUsd - a.balanceUsd);

  return (
    <div className="min-h-[100dvh] bg-background relative">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 px-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-card border border-border">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
            />
          </div>
          <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
            <Settings className="w-4.5 h-4.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-5">
        {!isConnected ? (
          <div className="mt-4">
            <div
              className="rounded-3xl p-6 text-center active:scale-[0.98] transition-transform cursor-pointer"
              style={{ background: 'linear-gradient(135deg, hsl(142 76% 25%), hsl(142 76% 15%))' }}
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
              style={{ background: 'linear-gradient(135deg, hsl(142 50% 22%), hsl(142 60% 12%))' }}
            >
              <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at top right, hsl(142 76% 52% / 0.3), transparent 60%)' }} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-foreground/70 font-medium">Total Balance</p>
                  <button onClick={() => setHideBalance(!hideBalance)} className="p-1 active:scale-90 transition-transform">
                    {hideBalance ? <EyeOff className="w-4.5 h-4.5 text-foreground/50" /> : <Eye className="w-4.5 h-4.5 text-foreground/50" />}
                  </button>
                </div>
                <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">
                  {hideBalance ? '••••••' : `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
                {priceError && (
                  <p className="text-xs text-yellow-500 mt-1">⚠️ Prices may be inaccurate</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2.5">
              {quickActions.map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-card border border-border active:scale-95 active:bg-secondary transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                </button>
              ))}
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
              ) : filteredBalances.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No tokens found</p>
              ) : (
                <div className="space-y-2">
                  {filteredBalances.map((token) => (
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
    </div>
  );
};

export default Home;
