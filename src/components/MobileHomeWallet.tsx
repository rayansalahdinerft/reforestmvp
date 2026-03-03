import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, ArrowUpRight, ArrowLeftRight, QrCode, TrendingDown, TrendingUp } from 'lucide-react';

const MobileHomeWallet = () => {
  const { balances, totalValue, loading, isConnected, priceError } = useWalletBalance();
  const { openConnect } = useWallet();

  if (!isConnected) {
    return (
      <div className="px-4 py-8">
        <div className="rounded-2xl bg-card border border-border p-6 text-center" onClick={openConnect}>
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-foreground mb-1">Connect Your Wallet</h2>
          <p className="text-sm text-muted-foreground">Tap to view your portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-2 pb-4 space-y-5">
      {/* A) Global Balance */}
      <div className="text-center py-4">
        <p className="text-4xl font-bold text-foreground tabular-nums tracking-tight">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        {priceError && (
          <p className="text-xs text-yellow-500 mt-1">⚠️ Prices may be inaccurate</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: ArrowUpRight, label: 'Send' },
          { icon: ArrowLeftRight, label: 'Swap', href: '/' },
          { icon: QrCode, label: 'Receive' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </button>
        ))}
      </div>

      {/* B) Token List */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Tokens</h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : balances.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No tokens found</p>
        ) : (
          <div className="space-y-1.5">
            {balances
              .sort((a, b) => b.balanceUsd - a.balanceUsd)
              .map((token) => (
                <div
                  key={token.symbol}
                  className="flex items-center justify-between px-3 py-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {token.logoURI ? (
                      <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {token.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm text-foreground">{token.name}</p>
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
    </div>
  );
};

export default MobileHomeWallet;
