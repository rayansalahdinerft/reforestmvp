import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Loader2, ExternalLink } from 'lucide-react';
import { useHistoricalPrices, type Timeframe } from '@/hooks/useHistoricalPrices';
import type { MarketToken } from '@/hooks/useMarketData';

interface TokenDetailModalProps {
  token: MarketToken | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TokenDetailModal = ({ token, open, onOpenChange }: TokenDetailModalProps) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  
  const { data, loading } = useHistoricalPrices(token?.symbol.toUpperCase() || '', timeframe);
  
  // Calculate price change for selected timeframe
  const priceChange = useMemo(() => {
    if (data.length < 2) return { value: 0, percent: 0 };
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percent = (change / firstPrice) * 100;
    return { value: change, percent };
  }, [data]);

  // Calculate Y-axis domain
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.1 || maxPrice * 0.02;
    return [minPrice - padding, maxPrice + padding];
  }, [data]);

  const isPositive = priceChange.percent >= 0;
  const chartColor = isPositive ? 'hsl(142 76% 52%)' : 'hsl(0 84% 60%)';

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return 'N/A';
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (price >= 0.0001) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
    return price.toExponential(2);
  };

  const formatMarketCap = (value: number | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (!token) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={token.image} 
              alt={token.symbol} 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <span className="text-foreground">{token.name}</span>
              <span className="text-muted-foreground ml-2 uppercase">{token.symbol}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price & Stats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground tabular-nums">
                ${formatPrice(token.current_price)}
              </p>
              <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium tabular-nums">
                  {isPositive ? '+' : ''}{priceChange.percent.toFixed(2)}% ({timeframe})
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Market Cap: {formatMarketCap(token.market_cap)}</p>
              <p>24h Volume: {formatMarketCap(token.total_volume)}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/50 z-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-detail-${token.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis 
                  domain={yDomain}
                  hide={true}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  strokeWidth={2}
                  fill={`url(#gradient-detail-${token.symbol})`}
                  isAnimationActive={!loading}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Timeframe buttons */}
          <div className="flex gap-2">
            {(['1H', '1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                disabled={loading}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* CoinGecko link */}
          <a 
            href={`https://www.coingecko.com/en/coins/${token.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View on CoinGecko <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenDetailModal;
