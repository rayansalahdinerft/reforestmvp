import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Timeframe = '1H' | '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface PricePoint {
  time: string;
  price: number;
  timestamp: number;
}

interface HistoricalDataResult {
  data: PricePoint[];
  loading: boolean;
  error: string | null;
  isLiveData: boolean; // Indicates if data is from API or fallback
  refetch: () => void;
}

// CoinCodex symbol mapping
interface TokenConfig {
  symbol: string; // CoinCodex uses uppercase symbols
  fallbackPrice: number;
}

const TOKEN_CONFIG: Record<string, TokenConfig> = {
  // Major
  ETH: { symbol: 'ETH', fallbackPrice: 2800 },
  BTC: { symbol: 'BTC', fallbackPrice: 87000 },
  SOL: { symbol: 'SOL', fallbackPrice: 135 },
  BNB: { symbol: 'BNB', fallbackPrice: 620 },
  // Layer 2
  MATIC: { symbol: 'MATIC', fallbackPrice: 0.20 },
  POL: { symbol: 'MATIC', fallbackPrice: 0.20 },
  ARB: { symbol: 'ARB', fallbackPrice: 0.15 },
  OP: { symbol: 'OP', fallbackPrice: 0.26 },
  AVAX: { symbol: 'AVAX', fallbackPrice: 11 },
  STRK: { symbol: 'STRK', fallbackPrice: 0.14 },
  // DeFi
  UNI: { symbol: 'UNI', fallbackPrice: 5.50 },
  AAVE: { symbol: 'AAVE', fallbackPrice: 165 },
  LINK: { symbol: 'LINK', fallbackPrice: 13 },
  CRV: { symbol: 'CRV', fallbackPrice: 0.42 },
  // Stablecoins
  USDC: { symbol: 'USDC', fallbackPrice: 1 },
  USDT: { symbol: 'USDT', fallbackPrice: 1 },
  DAI: { symbol: 'DAI', fallbackPrice: 1 },
  // Memecoins
  DOGE: { symbol: 'DOGE', fallbackPrice: 0.18 },
  SHIB: { symbol: 'SHIB', fallbackPrice: 0.0000125 },
  PEPE: { symbol: 'PEPE', fallbackPrice: 0.0000085 },
  BONK: { symbol: 'BONK', fallbackPrice: 0.000018 },
};

// Local cache for historical data
const LOCAL_CACHE_KEY = 'historical_prices_cache_v2';
const LOCAL_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

interface CacheEntry {
  data: PricePoint[];
  timestamp: number;
}

const readLocalCache = (key: string): PricePoint[] | null => {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as Record<string, CacheEntry>;
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() - entry.timestamp > LOCAL_CACHE_TTL) return null;
    return entry.data;
  } catch {
    return null;
  }
};

const writeLocalCache = (key: string, data: PricePoint[]) => {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    cache[key] = { data, timestamp: Date.now() };
    // Keep only last 50 entries
    const keys = Object.keys(cache);
    if (keys.length > 50) {
      const oldest = keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp).slice(0, 10);
      oldest.forEach(k => delete cache[k]);
    }
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
};

// Helper to find token config by symbol (case-insensitive)
const getTokenConfig = (symbol: string): TokenConfig | undefined => {
  const upperSymbol = symbol.toUpperCase();
  return TOKEN_CONFIG[upperSymbol];
};

// Map timeframe to CoinGecko days parameter
const getTimeframeDays = (timeframe: Timeframe): string => {
  switch (timeframe) {
    case '1H': return '1';
    case '1D': return '1';
    case '1W': return '7';
    case '1M': return '30';
    case '1Y': return '365';
    case 'ALL': return 'max';
    default: return '1';
  }
};

// Format timestamp based on timeframe
const formatTime = (timestamp: number, timeframe: Timeframe): string => {
  const date = new Date(timestamp);
  
  switch (timeframe) {
    case '1H':
    case '1D':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '1W':
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    case '1M':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case '1Y':
    case 'ALL':
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    default:
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
};

export const useHistoricalPrices = (symbol: string, timeframe: Timeframe): HistoricalDataResult => {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState(true);

  const fetchHistoricalData = useCallback(async () => {
    const tokenConfig = getTokenConfig(symbol);
    
    if (!tokenConfig) {
      console.warn(`Unknown symbol for historical prices: ${symbol}`);
      setError(`Unknown symbol: ${symbol}`);
      setLoading(false);
      setIsLiveData(false);
      return;
    }

    const { symbol: coinSymbol } = tokenConfig;
    const days = getTimeframeDays(timeframe);
    const cacheKey = `coincodex-${coinSymbol}-${days}`;

    // Check local cache first
    const cached = readLocalCache(cacheKey);
    if (cached && cached.length > 0) {
      setData(cached);
      setLoading(false);
      setIsLiveData(true); // cached data was originally live
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call CoinCodex edge function
      const { data: result, error: fnError } = await supabase.functions.invoke('coincodex-history', {
        body: { coinId: coinSymbol, days },
      });

      if (fnError) throw fnError;
      
      if (!result.prices || !Array.isArray(result.prices)) {
        throw new Error('Invalid data format');
      }

      let prices: [number, number][] = result.prices;

      // For 1H, filter to last hour
      if (timeframe === '1H') {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        prices = prices.filter(([timestamp]) => timestamp >= oneHourAgo);
      }

      // Adjust sampling based on timeframe
      let maxPoints = 24;
      if (timeframe === '1Y') maxPoints = 52;
      if (timeframe === 'ALL') maxPoints = 100;

      const step = Math.max(1, Math.floor(prices.length / maxPoints));
      const sampledPrices = prices.filter((_, index) => index % step === 0);

      const formattedData: PricePoint[] = sampledPrices.map(([timestamp, price]) => ({
        timestamp,
        time: formatTime(timestamp, timeframe),
        price: price < 0.01 ? parseFloat(price.toPrecision(4)) : parseFloat(price.toFixed(2)),
      }));

      setData(formattedData);
      setIsLiveData(!result.cached || !result.stale);
      writeLocalCache(cacheKey, formattedData);
    } catch (err) {
      console.error('Error fetching historical prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsLiveData(false);
      
      // Generate minimal fallback showing flat line at current price
      const fallbackData = generateMinimalFallback(timeframe, tokenConfig.fallbackPrice);
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  return { data, loading, error, isLiveData, refetch: fetchHistoricalData };
};

// Generate minimal fallback (flat line at current price with label)
const generateMinimalFallback = (timeframe: Timeframe, currentPrice: number): PricePoint[] => {
  const now = Date.now();
  const points: PricePoint[] = [];
  
  let intervalMs: number;
  let count: number;
  
  switch (timeframe) {
    case '1H':
      intervalMs = 5 * 60 * 1000;
      count = 12;
      break;
    case '1D':
      intervalMs = 60 * 60 * 1000;
      count = 24;
      break;
    case '1W':
      intervalMs = 24 * 60 * 60 * 1000;
      count = 7;
      break;
    case '1M':
      intervalMs = 24 * 60 * 60 * 1000;
      count = 30;
      break;
    case '1Y':
      intervalMs = 7 * 24 * 60 * 60 * 1000;
      count = 52;
      break;
    case 'ALL':
      intervalMs = 30 * 24 * 60 * 60 * 1000;
      count = 48;
      break;
    default:
      intervalMs = 60 * 60 * 1000;
      count = 24;
  }
  
  // Generate flat line at current price - don't fake historical data
  for (let i = 0; i < count; i++) {
    const timestamp = now - ((count - 1 - i) * intervalMs);
    points.push({
      timestamp,
      time: formatTime(timestamp, timeframe),
      price: currentPrice < 0.01 ? parseFloat(currentPrice.toPrecision(4)) : parseFloat(currentPrice.toFixed(2)),
    });
  }
  
  return points;
};

export default useHistoricalPrices;
