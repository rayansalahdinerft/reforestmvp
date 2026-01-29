import { useState, useEffect, useCallback } from 'react';

export type Timeframe = '1H' | '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface PricePoint {
  time: string;
  price: number;
  timestamp: number;
}

interface HistoricalData {
  data: PricePoint[];
  loading: boolean;
  error: string | null;
}

// CoinGecko IDs and fallback prices
const COINGECKO_IDS: Record<string, { id: string; fallbackPrice: number }> = {
  ETH: { id: 'ethereum', fallbackPrice: 2900 },
  BTC: { id: 'bitcoin', fallbackPrice: 95000 },
  SOL: { id: 'solana', fallbackPrice: 120 },
  BNB: { id: 'binancecoin', fallbackPrice: 650 },
  MATIC: { id: 'matic-network', fallbackPrice: 0.5 },
  ARB: { id: 'arbitrum', fallbackPrice: 0.8 },
  OP: { id: 'optimism', fallbackPrice: 1.5 },
  AVAX: { id: 'avalanche-2', fallbackPrice: 25 },
};

// Map timeframe to CoinGecko parameters
const getTimeframeParams = (timeframe: Timeframe): { days: string; interval?: string } => {
  switch (timeframe) {
    case '1H':
      return { days: '1' }; // Get 1 day data, we'll filter to last hour
    case '1D':
      return { days: '1' };
    case '1W':
      return { days: '7' };
    case '1M':
      return { days: '30' };
    case '1Y':
      return { days: '365' };
    case 'ALL':
      return { days: 'max' };
    default:
      return { days: '1' };
  }
};

// Format timestamp based on timeframe
const formatTime = (timestamp: number, timeframe: Timeframe): string => {
  const date = new Date(timestamp);
  
  switch (timeframe) {
    case '1H':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '1D':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '1W':
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    case '1M':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case '1Y':
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    case 'ALL':
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    default:
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
};

export const useHistoricalPrices = (symbol: string, timeframe: Timeframe) => {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = useCallback(async () => {
    const tokenConfig = COINGECKO_IDS[symbol.toUpperCase()];
    
    if (!tokenConfig) {
      setError(`Unknown symbol: ${symbol}`);
      setLoading(false);
      return;
    }

    const { id: coinId, fallbackPrice } = tokenConfig;

    setLoading(true);
    setError(null);

    try {
      const { days } = getTimeframeParams(timeframe);
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.prices || !Array.isArray(result.prices)) {
        throw new Error('Invalid data format');
      }

      let prices: [number, number][] = result.prices;

      // For 1H, filter to last hour
      if (timeframe === '1H') {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        prices = prices.filter(([timestamp]) => timestamp >= oneHourAgo);
      }

      // Reduce data points for better performance (max 24 points)
      const step = Math.max(1, Math.floor(prices.length / 24));
      const sampledPrices = prices.filter((_, index) => index % step === 0);

      const formattedData: PricePoint[] = sampledPrices.map(([timestamp, price]) => ({
        timestamp,
        time: formatTime(timestamp, timeframe),
        price: parseFloat(price.toFixed(2)),
      }));

      setData(formattedData);
    } catch (err) {
      console.error('Error fetching historical prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      // Generate fallback data on error with realistic base price
      const fallbackData = generateFallbackData(timeframe, fallbackPrice);
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  return { data, loading, error, refetch: fetchHistoricalData };
};

// Fallback data generator when API fails
const generateFallbackData = (timeframe: Timeframe, basePrice: number = 100): PricePoint[] => {
  const now = Date.now();
  const points: PricePoint[] = [];
  
  let intervalMs: number;
  let count: number;
  let volatility: number;
  
  switch (timeframe) {
    case '1H':
      intervalMs = 5 * 60 * 1000; // 5 minutes
      count = 12;
      volatility = 0.002; // 0.2% per interval
      break;
    case '1D':
      intervalMs = 60 * 60 * 1000; // 1 hour
      count = 24;
      volatility = 0.005; // 0.5% per interval
      break;
    case '1W':
      intervalMs = 24 * 60 * 60 * 1000; // 1 day
      count = 7;
      volatility = 0.02; // 2% per interval
      break;
    case '1M':
      intervalMs = 24 * 60 * 60 * 1000; // 1 day
      count = 30;
      volatility = 0.03; // 3% per interval
      break;
    case '1Y':
      intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
      count = 52;
      volatility = 0.05; // 5% per interval
      break;
    case 'ALL':
      intervalMs = 30 * 24 * 60 * 60 * 1000; // 1 month
      count = 48; // 4 years
      volatility = 0.08; // 8% per interval
      break;
    default:
      intervalMs = 60 * 60 * 1000;
      count = 24;
      volatility = 0.005;
  }
  
  let price = basePrice;
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - (i * intervalMs);
    price = price * (1 + (Math.random() - 0.5) * volatility);
    points.push({
      timestamp,
      time: formatTime(timestamp, timeframe),
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return points;
};

export default useHistoricalPrices;
