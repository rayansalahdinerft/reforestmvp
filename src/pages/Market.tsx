import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import SparklineChart from "@/components/SparklineChart";
import { useMarketData, TOKEN_CATEGORIES } from "@/hooks/useMarketData";
import { TrendingUp, TrendingDown, Search, RefreshCw, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";

const CATEGORIES = ['All', 'Major', 'Layer 2', 'DeFi', 'Stablecoin', 'Meme'];

const Market = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { tokens, loading, error, refetch } = useMarketData();

  const filteredTokens = useMemo(() => {
    return tokens.filter(token => {
      const category = TOKEN_CATEGORIES[token.id] || 'Other';
      const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
      const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tokens, selectedCategory, searchQuery]);

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (price >= 0.0001) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
    return price.toExponential(2);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            <span className="text-primary">Market</span> Overview
          </h1>
          <p className="text-lg text-muted-foreground">
            Live prices with 7-day sparkline charts
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-slide-up">
          {/* Search */}
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

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Results count & error */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTokens.length} tokens
          </p>
          {error && (
            <p className="text-sm text-yellow-500">{error}</p>
          )}
        </div>

        {/* Loading state */}
        {loading && tokens.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Token Table */}
        {tokens.length > 0 && (
          <div className="swap-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
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
                    // Sample sparkline data for performance (every 4th point)
                    const sampledSparkline = sparklineData.filter((_, i) => i % 4 === 0);

                    return (
                      <tr key={token.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-4 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={token.image} 
                              alt={token.symbol} 
                              className="w-8 h-8 rounded-full"
                              loading="lazy"
                            />
                            <div>
                              <p className="font-semibold text-foreground uppercase">{token.symbol}</p>
                              <p className="text-xs text-muted-foreground">{token.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-semibold text-foreground tabular-nums">
                            ${formatPrice(token.current_price)}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="font-medium tabular-nums">
                              {isPositive ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2) || '0.00'}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            <SparklineChart 
                              data={sampledSparkline} 
                              width={100} 
                              height={32}
                              isPositive={isPositive}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                            {category}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredTokens.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No tokens found matching your criteria</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Market;
