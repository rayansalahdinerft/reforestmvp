import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { Wallet, TrendingUp, TrendingDown, RefreshCw, ExternalLink } from "lucide-react";

const Portfolio = () => {
  const { balances, totalValue, loading, isConnected, address, refetch } = useWalletBalance();
  const { prices, getPrice, get24hChange } = useTokenPrices(['ETH', 'BTC', 'SOL', 'MATIC', 'ARB', 'OP', 'AVAX', 'BNB']);

  const marketOverview = [
    { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
    { symbol: 'SOL', name: 'Solana', id: 'solana' },
    { symbol: 'BNB', name: 'BNB', id: 'binancecoin' },
    { symbol: 'MATIC', name: 'Polygon', id: 'matic-network' },
    { symbol: 'ARB', name: 'Arbitrum', id: 'arbitrum' },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your assets and watch your impact grow
          </p>
        </div>

        {/* Wallet Value Card */}
        <div className="mb-10 animate-slide-up">
          <div className="swap-card p-8">
            {!isConnected ? (
              <div className="text-center py-8">
                <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
                <p className="text-muted-foreground">Connect your wallet to view your portfolio</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
                    <h2 className="text-4xl font-bold text-foreground">
                      ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                  </div>
                  <button
                    onClick={refetch}
                    className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-5 h-5 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="text-xs text-muted-foreground mb-6 flex items-center gap-2">
                  <span className="font-mono">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>

                {/* Token Balances */}
                <div className="space-y-3">
                  {balances.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all">
                      <div className="flex items-center gap-3">
                        {token.logoURI && (
                          <img src={token.logoURI} alt={token.symbol} className="w-10 h-10 rounded-full" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{token.symbol}</p>
                          <p className="text-sm text-muted-foreground">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{token.balance}</p>
                        <p className="text-sm text-muted-foreground">${token.balanceUsd.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Market Overview */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold text-foreground mb-4">Market Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {marketOverview.map((token) => {
              const price = prices[token.id]?.usd;
              const change = prices[token.id]?.usd_24h_change;
              const isPositive = change && change > 0;

              return (
                <div key={token.symbol} className="swap-card p-4 text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">{token.symbol}</p>
                  <p className="text-lg font-bold text-foreground">
                    ${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '--'}
                  </p>
                  {change !== undefined && (
                    <div className={`flex items-center justify-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{Math.abs(change).toFixed(2)}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
