import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import PriceChart from "@/components/PriceChart";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { useState, useMemo } from "react";

const ALL_TOKENS = [
  // Major
  { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png', category: 'Major' },
  { symbol: 'ETH', name: 'Ethereum', id: 'ethereum', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png', category: 'Major' },
  { symbol: 'BNB', name: 'BNB', id: 'binancecoin', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png', category: 'Major' },
  { symbol: 'SOL', name: 'Solana', id: 'solana', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png', category: 'Major' },
  // Layer 2
  { symbol: 'MATIC', name: 'Polygon', id: 'matic-network', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png', category: 'Layer 2' },
  { symbol: 'ARB', name: 'Arbitrum', id: 'arbitrum', logo: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg', category: 'Layer 2' },
  { symbol: 'OP', name: 'Optimism', id: 'optimism', logo: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png', category: 'Layer 2' },
  { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png', category: 'Layer 2' },
  // DeFi
  { symbol: 'UNI', name: 'Uniswap', id: 'uniswap', logo: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png', category: 'DeFi' },
  { symbol: 'AAVE', name: 'Aave', id: 'aave', logo: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png', category: 'DeFi' },
  { symbol: 'LINK', name: 'Chainlink', id: 'chainlink', logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', category: 'DeFi' },
  { symbol: 'CRV', name: 'Curve', id: 'curve-dao-token', logo: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png', category: 'DeFi' },
  // Stablecoins
  { symbol: 'USDC', name: 'USD Coin', id: 'usd-coin', logo: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png', category: 'Stablecoin' },
  { symbol: 'USDT', name: 'Tether', id: 'tether', logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', category: 'Stablecoin' },
  { symbol: 'DAI', name: 'Dai', id: 'dai', logo: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png', category: 'Stablecoin' },
  // Meme
  { symbol: 'DOGE', name: 'Dogecoin', id: 'dogecoin', logo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', category: 'Meme' },
  { symbol: 'SHIB', name: 'Shiba Inu', id: 'shiba-inu', logo: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png', category: 'Meme' },
  { symbol: 'PEPE', name: 'Pepe', id: 'pepe', logo: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg', category: 'Meme' },
  { symbol: 'BONK', name: 'Bonk', id: 'bonk', logo: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg', category: 'Meme' },
];

const CATEGORIES = ['All', 'Major', 'Layer 2', 'DeFi', 'Stablecoin', 'Meme'];

const Market = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { prices } = useTokenPrices(ALL_TOKENS.map(t => t.symbol));

  const filteredTokens = useMemo(() => {
    return ALL_TOKENS.filter(token => {
      const matchesCategory = selectedCategory === 'All' || token.category === selectedCategory;
      const matchesSearch = token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           token.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            Live prices and charts for top cryptocurrencies
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

          {/* View mode toggle */}
          <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              Charts
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredTokens.length} tokens
        </p>

        {/* Grid View with Charts */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
            {filteredTokens.map((token) => {
              const priceData = prices[token.id];
              const currentPrice = priceData?.usd ?? 0;
              const change24h = priceData?.usd_24h_change ?? 0;

              return (
                <PriceChart
                  key={token.symbol}
                  symbol={token.symbol}
                  name={token.name}
                  currentPrice={currentPrice}
                  change24h={change24h}
                  logoUrl={token.logo}
                  coinId={token.id}
                />
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="swap-card overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">#</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Token</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">24h Change</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTokens.map((token, index) => {
                    const priceData = prices[token.id];
                    const currentPrice = priceData?.usd ?? 0;
                    const change24h = priceData?.usd_24h_change ?? 0;
                    const isPositive = change24h >= 0;

                    return (
                      <tr key={token.symbol} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-4 px-4 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="font-semibold text-foreground">{token.symbol}</p>
                              <p className="text-xs text-muted-foreground">{token.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="font-semibold text-foreground tabular-nums">
                            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: currentPrice < 1 ? 6 : 2 })}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="font-medium tabular-nums">{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground">
                            {token.category}
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
      </main>
    </div>
  );
};

export default Market;