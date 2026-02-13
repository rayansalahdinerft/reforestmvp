import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import NftGallery from "@/components/impact/NftGallery";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useWalletStats } from "@/hooks/useWalletStats";
import { Wallet, RefreshCw } from "lucide-react";

const Portfolio = () => {
  const { balances, totalValue, loading, isConnected, refetch, priceError } = useWalletBalance();
  const { stats } = useWalletStats();
  const treesPlanted = stats.totalTrees;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-lg text-muted-foreground">Your tokens at a glance</p>
        </div>

        {!isConnected ? (
          <div className="swap-card p-8 text-center animate-slide-up">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Connect your wallet to view your portfolio</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wallet balances */}
            <div className="swap-card p-6 animate-slide-up backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Wallet Value</p>
                  <h2 className="text-3xl font-bold text-foreground tabular-nums">
                    ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>
                <button onClick={refetch} className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all" disabled={loading}>
                  <RefreshCw className={`w-5 h-5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
              {priceError && (
                <p className="text-yellow-500 text-xs mb-3">⚠️ Price data may be inaccurate</p>
              )}
              {balances.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No tokens found</p>
              ) : (
                <div className="space-y-2">
                  {balances.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all">
                      <div className="flex items-center gap-3">
                        {token.logoURI && <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full" />}
                        <div>
                          <p className="font-semibold text-foreground text-sm">{token.symbol}</p>
                          <p className="text-xs text-muted-foreground">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm tabular-nums">{token.balance}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">${token.balanceUsd.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NFT unlock reveal only */}
            <NftGallery treesPlanted={treesPlanted} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
