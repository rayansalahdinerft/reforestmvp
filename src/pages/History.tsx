import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useSwapHistory } from "@/hooks/useSwapHistory";
import { useWallet } from '@/hooks/useWallet';
import { Wallet, ArrowRightLeft, ExternalLink, TreePine, DollarSign, Clock, Leaf } from "lucide-react";
import { format } from "date-fns";

const getExplorerUrl = (txHash: string, chainId: number) => {
  const explorers: Record<number, string> = { 1: "https://etherscan.io" };
  return `${explorers[chainId] || "https://etherscan.io"}/tx/${txHash}`;
};

const History = () => {
  const { isConnected } = useWallet();
  const { history, loading, totalStats } = useSwapHistory();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Swap <span className="text-primary">History</span>
          </h1>
          <p className="text-lg text-muted-foreground">Your complete transaction log</p>
        </div>

        {!isConnected ? (
          <div className="swap-card p-8 text-center animate-slide-up">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Connect your wallet to view your swap history</p>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* Stats summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="swap-card p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <ArrowRightLeft className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">{totalStats.totalSwaps}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Swaps</p>
              </div>
              <div className="swap-card p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  ${totalStats.totalDonated.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Donated</p>
              </div>
              <div className="swap-card p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-2">
                  <TreePine className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {totalStats.totalTrees.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Trees Planted</p>
              </div>
            </div>

            {/* History list */}
            <div className="swap-card overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3 animate-spin" />
                  <p className="text-muted-foreground">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="p-8 text-center">
                  <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-foreground font-semibold mb-1">No swaps yet</p>
                  <p className="text-muted-foreground text-sm">Make your first swap to start planting trees!</p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <ArrowRightLeft className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground truncate">
                              {parseFloat(entry.sell_amount).toLocaleString(undefined, { maximumFractionDigits: 6 })} {entry.sell_token}
                            </span>
                            <span className="text-muted-foreground text-xs">→</span>
                            <span className="text-sm font-semibold text-primary truncate">
                              {parseFloat(entry.buy_amount).toLocaleString(undefined, { maximumFractionDigits: 6 })} {entry.buy_token}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] text-muted-foreground">
                              {format(new Date(entry.created_at), "MMM d, yyyy · HH:mm")}
                            </span>
                            {Number(entry.donation_usd) > 0 && (
                              <span className="text-[11px] text-primary/80 flex items-center gap-0.5">
                                <Leaf className="w-3 h-3" />
                                ${Number(entry.donation_usd).toFixed(2)}
                              </span>
                            )}
                            {Number(entry.trees_planted) > 0 && (
                              <span className="text-[11px] text-emerald-500/80 flex items-center gap-0.5">
                                <TreePine className="w-3 h-3" />
                                {Number(entry.trees_planted).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <a
                        href={getExplorerUrl(entry.tx_hash, entry.chain_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl hover:bg-secondary transition-colors shrink-0"
                        title="View on explorer"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
