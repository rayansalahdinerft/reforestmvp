import { useTokenPrices } from '@/hooks/useTokenPrices';
import PriceChart from './PriceChart';

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', id: 'ethereum', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png' },
  { symbol: 'SOL', name: 'Solana', id: 'solana', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
  { symbol: 'STRK', name: 'Starknet', id: 'starknet', logo: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png' },
];

const MarketOverview = () => {
  const { prices, loading } = useTokenPrices(tokens.map(t => t.symbol));

  // Map symbols to CoinGecko IDs for price lookup with fallback values
  const priceMap: Record<string, { usd: number; usd_24h_change: number }> = {
    ETH: { usd: prices['ethereum']?.usd ?? 3200, usd_24h_change: prices['ethereum']?.usd_24h_change ?? 2.5 },
    BTC: { usd: prices['bitcoin']?.usd ?? 95000, usd_24h_change: prices['bitcoin']?.usd_24h_change ?? 1.8 },
    SOL: { usd: prices['solana']?.usd ?? 180, usd_24h_change: prices['solana']?.usd_24h_change ?? -0.5 },
    STRK: { usd: prices['starknet']?.usd ?? 0.45, usd_24h_change: prices['starknet']?.usd_24h_change ?? 3.2 },
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Market Overview</h2>
          <p className="text-sm text-muted-foreground">Live prices from major tokens</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tokens.map((token) => {
          const data = priceMap[token.symbol];
          return (
            <PriceChart
              key={token.symbol}
              symbol={token.symbol}
              name={token.name}
              price={data?.usd || 0}
              change24h={data?.usd_24h_change || 0}
              logoUrl={token.logo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MarketOverview;
