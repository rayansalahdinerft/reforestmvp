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

// CoinGecko IDs mapped by both symbol and coingecko id
// Historical price ranges for realistic fallback data (approximate ranges)
interface TokenConfig {
  id: string;
  fallbackPrice: number;
  // Historical price ranges for more realistic fallback
  historicalRanges: {
    '1Y': { min: number; max: number };
    'ALL': { min: number; max: number; startYear: number };
  };
}

const COINGECKO_IDS: Record<string, TokenConfig> = {
  // Major
  ETH: { id: 'ethereum', fallbackPrice: 2800, historicalRanges: { '1Y': { min: 1500, max: 4000 }, 'ALL': { min: 80, max: 4800, startYear: 2015 } } },
  BTC: { id: 'bitcoin', fallbackPrice: 87000, historicalRanges: { '1Y': { min: 25000, max: 100000 }, 'ALL': { min: 200, max: 100000, startYear: 2013 } } },
  SOL: { id: 'solana', fallbackPrice: 135, historicalRanges: { '1Y': { min: 15, max: 260 }, 'ALL': { min: 0.5, max: 260, startYear: 2020 } } },
  BNB: { id: 'binancecoin', fallbackPrice: 620, historicalRanges: { '1Y': { min: 200, max: 700 }, 'ALL': { min: 10, max: 700, startYear: 2017 } } },
  // Layer 2
  MATIC: { id: 'matic-network', fallbackPrice: 0.42, historicalRanges: { '1Y': { min: 0.3, max: 1.2 }, 'ALL': { min: 0.01, max: 2.9, startYear: 2019 } } },
  POL: { id: 'matic-network', fallbackPrice: 0.42, historicalRanges: { '1Y': { min: 0.3, max: 1.2 }, 'ALL': { min: 0.01, max: 2.9, startYear: 2019 } } },
  ARB: { id: 'arbitrum', fallbackPrice: 0.55, historicalRanges: { '1Y': { min: 0.4, max: 2.4 }, 'ALL': { min: 0.4, max: 2.4, startYear: 2023 } } },
  OP: { id: 'optimism', fallbackPrice: 1.25, historicalRanges: { '1Y': { min: 0.8, max: 4.5 }, 'ALL': { min: 0.4, max: 4.5, startYear: 2022 } } },
  AVAX: { id: 'avalanche-2', fallbackPrice: 22, historicalRanges: { '1Y': { min: 8, max: 50 }, 'ALL': { min: 3, max: 145, startYear: 2020 } } },
  STRK: { id: 'starknet', fallbackPrice: 0.38, historicalRanges: { '1Y': { min: 0.3, max: 2.5 }, 'ALL': { min: 0.3, max: 2.5, startYear: 2024 } } },
  // DeFi
  UNI: { id: 'uniswap', fallbackPrice: 7.80, historicalRanges: { '1Y': { min: 3, max: 17 }, 'ALL': { min: 1, max: 45, startYear: 2020 } } },
  AAVE: { id: 'aave', fallbackPrice: 185, historicalRanges: { '1Y': { min: 50, max: 400 }, 'ALL': { min: 25, max: 670, startYear: 2020 } } },
  LINK: { id: 'chainlink', fallbackPrice: 14.50, historicalRanges: { '1Y': { min: 5, max: 25 }, 'ALL': { min: 0.15, max: 52, startYear: 2017 } } },
  CRV: { id: 'curve-dao-token', fallbackPrice: 0.52, historicalRanges: { '1Y': { min: 0.2, max: 0.8 }, 'ALL': { min: 0.2, max: 6, startYear: 2020 } } },
  // Stablecoins
  USDC: { id: 'usd-coin', fallbackPrice: 1, historicalRanges: { '1Y': { min: 0.99, max: 1.01 }, 'ALL': { min: 0.97, max: 1.03, startYear: 2018 } } },
  USDT: { id: 'tether', fallbackPrice: 1, historicalRanges: { '1Y': { min: 0.99, max: 1.01 }, 'ALL': { min: 0.95, max: 1.05, startYear: 2015 } } },
  DAI: { id: 'dai', fallbackPrice: 1, historicalRanges: { '1Y': { min: 0.99, max: 1.01 }, 'ALL': { min: 0.90, max: 1.10, startYear: 2019 } } },
  // Memecoins
  DOGE: { id: 'dogecoin', fallbackPrice: 0.18, historicalRanges: { '1Y': { min: 0.05, max: 0.20 }, 'ALL': { min: 0.0001, max: 0.74, startYear: 2014 } } },
  SHIB: { id: 'shiba-inu', fallbackPrice: 0.0000125, historicalRanges: { '1Y': { min: 0.000007, max: 0.00003 }, 'ALL': { min: 0.0000001, max: 0.00009, startYear: 2020 } } },
  PEPE: { id: 'pepe', fallbackPrice: 0.0000085, historicalRanges: { '1Y': { min: 0.0000005, max: 0.000025 }, 'ALL': { min: 0.0000001, max: 0.000025, startYear: 2023 } } },
  BONK: { id: 'bonk', fallbackPrice: 0.000018, historicalRanges: { '1Y': { min: 0.000001, max: 0.00005 }, 'ALL': { min: 0.0000001, max: 0.00005, startYear: 2022 } } },
};

// Helper to find token config by symbol (case-insensitive)
const getTokenConfig = (symbol: string): TokenConfig | undefined => {
  const upperSymbol = symbol.toUpperCase();
  return COINGECKO_IDS[upperSymbol];
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
    const tokenConfig = getTokenConfig(symbol);
    
    if (!tokenConfig) {
      console.warn(`Unknown symbol for historical prices: ${symbol}`);
      setError(`Unknown symbol: ${symbol}`);
      setLoading(false);
      return;
    }

    const { id: coinId, fallbackPrice, historicalRanges } = tokenConfig;

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

      // Adjust sampling based on timeframe for better visualization
      // More data points for longer timeframes to show full history
      let maxPoints = 24;
      if (timeframe === '1Y') maxPoints = 52; // weekly points
      if (timeframe === 'ALL') maxPoints = 100; // show more detail for full history

      const step = Math.max(1, Math.floor(prices.length / maxPoints));
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
      
      // Generate fallback data on error with realistic historical ranges
      const fallbackData = generateRealisticFallbackData(timeframe, fallbackPrice, historicalRanges);
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

// Generate realistic fallback data based on historical price ranges
const generateRealisticFallbackData = (
  timeframe: Timeframe, 
  currentPrice: number,
  historicalRanges: TokenConfig['historicalRanges']
): PricePoint[] => {
  const now = Date.now();
  const points: PricePoint[] = [];
  
  let intervalMs: number;
  let count: number;
  let startPrice: number;
  let endPrice: number = currentPrice;
  
  switch (timeframe) {
    case '1H':
      intervalMs = 5 * 60 * 1000;
      count = 12;
      // Small variation for 1H
      startPrice = currentPrice * (0.98 + Math.random() * 0.04);
      break;
    case '1D':
      intervalMs = 60 * 60 * 1000;
      count = 24;
      startPrice = currentPrice * (0.95 + Math.random() * 0.10);
      break;
    case '1W':
      intervalMs = 24 * 60 * 60 * 1000;
      count = 7;
      startPrice = currentPrice * (0.85 + Math.random() * 0.30);
      break;
    case '1M':
      intervalMs = 24 * 60 * 60 * 1000;
      count = 30;
      startPrice = currentPrice * (0.70 + Math.random() * 0.60);
      break;
    case '1Y':
      intervalMs = 7 * 24 * 60 * 60 * 1000;
      count = 52;
      // Use 1Y historical range
      const range1Y = historicalRanges['1Y'];
      startPrice = range1Y.min + Math.random() * (range1Y.max - range1Y.min) * 0.5;
      break;
    case 'ALL':
      intervalMs = 30 * 24 * 60 * 60 * 1000;
      count = 48;
      // Use ALL historical range - start from near the minimum
      const rangeAll = historicalRanges['ALL'];
      startPrice = rangeAll.min + Math.random() * (rangeAll.max - rangeAll.min) * 0.2;
      break;
    default:
      intervalMs = 60 * 60 * 1000;
      count = 24;
      startPrice = currentPrice * 0.98;
  }
  
  // Generate smooth price progression from startPrice to endPrice
  for (let i = 0; i < count; i++) {
    const timestamp = now - ((count - 1 - i) * intervalMs);
    const progress = i / (count - 1);
    
    // Interpolate with some noise
    const basePrice = startPrice + (endPrice - startPrice) * progress;
    const noise = basePrice * (Math.random() - 0.5) * 0.1; // 10% noise
    const price = Math.max(0.0000001, basePrice + noise);
    
    points.push({
      timestamp,
      time: formatTime(timestamp, timeframe),
      price: price < 0.01 ? parseFloat(price.toPrecision(4)) : parseFloat(price.toFixed(2)),
    });
  }
  
  // Ensure last point matches current price
  if (points.length > 0) {
    points[points.length - 1].price = currentPrice;
  }
  
  return points;
};

export default useHistoricalPrices;
