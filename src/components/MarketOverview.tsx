import { useTokenPrices } from '@/hooks/useTokenPrices';
import PriceChart from './PriceChart';

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', id: 'ethereum', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
  { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png' },
  { symbol: 'SOL', name: 'Solana', id: 'solana', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
  { symbol: 'BNB', name: 'BNB', id: 'binancecoin', logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png' },
];

const MarketOverview = () => {
  const { prices } = useTokenPrices(tokens.map(t => t.symbol));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Market Overview</h2>
          <p className="text-sm text-muted-foreground">Live prices with real historical data</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tokens.map((token) => {
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
    </div>
  );
};

export default MarketOverview;
