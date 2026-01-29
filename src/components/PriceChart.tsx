import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useHistoricalPrices, type Timeframe } from '@/hooks/useHistoricalPrices';

interface PriceChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  logoUrl?: string;
  coinId: string;
}

const PriceChart = ({ symbol, name, currentPrice, change24h, logoUrl, coinId }: PriceChartProps) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  
  const { data, loading, error } = useHistoricalPrices(symbol, timeframe);
  
  const isPositive = change24h >= 0;
  const chartColor = isPositive ? 'hsl(142 76% 52%)' : 'hsl(0 84% 60%)';
  
  // Calculate price change for selected timeframe
  const priceChange = useMemo(() => {
    if (data.length < 2) return { value: 0, percent: 0 };
    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percent = (change / firstPrice) * 100;
    return { value: change, percent };
  }, [data]);

  // Calculate Y-axis domain to show variations properly
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100];
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const padding = (maxPrice - minPrice) * 0.1 || maxPrice * 0.02;
    return [minPrice - padding, maxPrice + padding];
  }, [data]);

  const timeframeIsPositive = priceChange.percent >= 0;
  const timeframeColor = timeframeIsPositive ? 'hsl(142 76% 52%)' : 'hsl(0 84% 60%)';
  
  return (
    <div className="swap-card p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img src={logoUrl} alt={symbol} className="w-10 h-10 rounded-full ring-2 ring-border" />
          )}
          <div>
            <h3 className="font-bold text-foreground">{symbol}</h3>
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-bold text-foreground tabular-nums">
            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className={`flex items-center justify-end gap-1 text-sm ${timeframeIsPositive ? 'text-primary' : 'text-destructive'}`}>
            {timeframeIsPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="tabular-nums">{timeframeIsPositive ? '+' : ''}{priceChange.percent.toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-32 -mx-2 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 z-10">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${symbol}-${timeframe}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={timeframeColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={timeframeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              interval="preserveStartEnd"
              minTickGap={30}
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
              formatter={(value: number) => [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={timeframeColor}
              strokeWidth={2}
              fill={`url(#gradient-${symbol}-${timeframe})`}
              isAnimationActive={!loading}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Timeframe buttons */}
      <div className="flex gap-1 mt-3">
        {(['1H', '1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            disabled={loading}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              timeframe === tf
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceChart;
