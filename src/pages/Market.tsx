import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import SparklineChart from "@/components/SparklineChart";
import TokenDetailModal from "@/components/TokenDetailModal";
import FloatingLeaves from "@/components/impact/FloatingLeaves";
import { useMarketData, TOKEN_CATEGORIES, type MarketToken } from "@/hooks/useMarketData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { TrendingUp, TrendingDown, Search, RefreshCw, Loader2, Database, AlertTriangle, Star } from "lucide-react";
import { useState, useMemo } from "react";

const CATEGORIES = ['All', 'Watchlist', 'Major', 'Layer 2', 'DeFi', 'Stablecoin', 'Meme'];

const Market = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<MarketToken | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { tokens, loading, error, refetch, isStale, isRateLimited } = useMarketData();
  const { toggle, isWatched, isConnected: walletConnected } = useWatchlist();

  const handleTokenClick = (token: MarketToken) => {
    setSelectedToken(token);
    setModalOpen(true);
  };

  const filteredTokens = useMemo(() => {
    return tokens.filter(token => {
      const category = TOKEN_CATEGORIES[token.id] || 'Other';
      const matchesCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Watchlist' ? isWatched(token.id) : category === selectedCategory);
      const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tokens, selectedCategory, searchQuery, isWatched]);

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return 'N/A';
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 10 });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLeaves />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-6 sm:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-4 tracking-tight">
            <span className="text-primary">Market</span> Overview
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground">
            Live prices with 1-year sparkline charts
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slide-up">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {category === 'Watchlist' && <Star className="w-3.5 h-3.5" />}
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Results count & status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTokens.length} tokens
            </p>
            {isStale && !isRateLimited && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/50 text-accent-foreground text-xs font-medium border border-border">
                <Database className="w-3 h-3" />
                Données en cache
              </span>
            )}
            {isRateLimited && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                <AlertTriangle className="w-3 h-3" />
                Rate-limited
              </span>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Loading */}
        {loading && tokens.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Token List */}
        {tokens.length > 0 && (
          <>
            {/* Mobile: Card layout */}
            <div className="flex flex-col gap-2 md:hidden animate-fade-in">
              {filteredTokens.map((token, index) => {
                const isPositive = token.price_change_percentage_24h >= 0;
                const category = TOKEN_CATEGORIES[token.id] || 'Other';
                const sparklineData = token.sparkline_in_7d?.price || [];
                const sampledSparkline = sparklineData.filter((_, i) => i % 4 === 0);
                const watched = isWatched(token.id);

                return (
                  <div
                    key={token.id}
                    className="swap-card p-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                    onClick={() => handleTokenClick(token)}
                  >
                    {/* Star */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggle(token.id); }}
                      className="p-0.5 shrink-0"
                    >
                      <Star className={`w-4 h-4 ${watched ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                    </button>

                    {/* Logo */}
                    <img src={token.image} alt={token.symbol} className="w-8 h-8 rounded-full shrink-0" loading="lazy" />

                    {/* Name + Category */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground uppercase truncate">{token.symbol}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{token.name}</p>
                    </div>

                    {/* Sparkline */}
                    <div className="shrink-0">
                      <SparklineChart data={sampledSparkline} width={60} height={24} isPositive={isPositive} />
                    </div>

                    {/* Price + Change */}
                    <div className="text-right shrink-0 min-w-[70px]">
                      <p className="font-semibold text-sm text-foreground tabular-nums">
                        ${formatPrice(token.current_price)}
                      </p>
                      <div className={`flex items-center justify-end gap-0.5 text-xs ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="tabular-nums">
                          {isPositive ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: Table layout */}
            <div className="swap-card overflow-hidden animate-fade-in hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground w-10"></th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">#</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Token</th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">24h</th>
                      <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">7D Chart</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTokens.map((token, index) => {
                      const isPositive = token.price_change_percentage_24h >= 0;
                      const category = TOKEN_CATEGORIES[token.id] || 'Other';
                      const sparklineData = token.sparkline_in_7d?.price || [];
                      const sampledSparkline = sparklineData.filter((_, i) => i % 4 === 0);
                      const watched = isWatched(token.id);

                      return (
                        <tr 
                          key={token.id} 
                          className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                          onClick={() => handleTokenClick(token)}
                        >
                          <td className="py-4 px-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggle(token.id); }}
                              className="p-1 rounded-md hover:bg-secondary/50 transition-colors"
                            >
                              <Star className={`w-4 h-4 transition-colors ${watched ? "fill-primary text-primary" : "text-muted-foreground/30 hover:text-muted-foreground"}`} />
                            </button>
                          </td>
                          <td className="py-4 px-4 text-sm text-muted-foreground">{index + 1}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={token.image} alt={token.symbol} className="w-8 h-8 rounded-full" loading="lazy" />
                              <div>
                                <p className="font-semibold text-foreground uppercase">{token.symbol}</p>
                                <p className="text-xs text-muted-foreground">{token.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <p className="font-semibold text-foreground tabular-nums">${formatPrice(token.current_price)}</p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              <span className="font-medium tabular-nums">
                                {isPositive ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center">
                              <SparklineChart data={sampledSparkline} width={100} height={32} isPositive={isPositive} />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">{category}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && filteredTokens.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {selectedCategory === 'Watchlist' 
                ? (walletConnected ? "No tokens in your watchlist yet. Click ⭐ to add some!" : "Connect your wallet to use the watchlist.")
                : "No tokens found matching your criteria"}
            </p>
          </div>
        )}

        <TokenDetailModal 
          token={selectedToken}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </main>
    </div>
  );
};

export default Market;
