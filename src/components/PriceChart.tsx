import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Generate mock price data for demonstration
const generatePriceData = (basePrice: number, volatility: number, trend: 'up' | 'down' | 'neutral') => {
  const data = [];
  let price = basePrice * (trend === 'down' ? 1.1 : trend === 'up' ? 0.9 : 1);
  
  for (let i = 0; i < 24; i++) {
    const change = (Math.random() - 0.5) * volatility;
    const trendFactor = trend === 'up' ? 0.005 : trend === 'down' ? -0.005 : 0;
    price = price * (1 + change + trendFactor);
    
    data.push({
      time: `${i}:00`,
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};

interface PriceChartProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  logoUrl?: string;
}

const PriceChart = ({ symbol, name, price, change24h, logoUrl }: PriceChartProps) => {
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D');
  
  const isPositive = change24h >= 0;
  const trend = change24h > 1 ? 'up' : change24h < -1 ? 'down' : 'neutral';
  const chartData = generatePriceData(price, 0.02, trend);
  
  const chartColor = isPositive ? 'hsl(142 76% 52%)' : 'hsl(0 84% 60%)';
  
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
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="tabular-nums">{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-32 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#gradient-${symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Timeframe buttons */}
      <div className="flex gap-1 mt-3">
        {(['1H', '1D', '1W', '1M'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              timeframe === tf
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
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
