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
  isLiveData: boolean;
  refetch: () => void;
}

interface TokenConfig {
  symbol: string;
  fallbackPrice: number;
}

const TOKEN_CONFIG: Record<string, TokenConfig> = {
  ETH: { symbol: 'ETH', fallbackPrice: 2800 },
  BTC: { symbol: 'BTC', fallbackPrice: 87000 },
  SOL: { symbol: 'SOL', fallbackPrice: 135 },
  BNB: { symbol: 'BNB', fallbackPrice: 620 },
  MATIC: { symbol: 'MATIC', fallbackPrice: 0.20 },
  POL: { symbol: 'MATIC', fallbackPrice: 0.20 },
  ARB: { symbol: 'ARB', fallbackPrice: 0.15 },
  OP: { symbol: 'OP', fallbackPrice: 0.26 },
  AVAX: { symbol: 'AVAX', fallbackPrice: 11 },
  STRK: { symbol: 'STRK', fallbackPrice: 0.14 },
  UNI: { symbol: 'UNI', fallbackPrice: 5.50 },
  AAVE: { symbol: 'AAVE', fallbackPrice: 165 },
  LINK: { symbol: 'LINK', fallbackPrice: 13 },
  CRV: { symbol: 'CRV', fallbackPrice: 0.42 },
  USDC: { symbol: 'USDC', fallbackPrice: 1 },
  USDT: { symbol: 'USDT', fallbackPrice: 1 },
  DAI: { symbol: 'DAI', fallbackPrice: 1 },
  DOGE: { symbol: 'DOGE', fallbackPrice: 0.18 },
  SHIB: { symbol: 'SHIB', fallbackPrice: 0.0000125 },
  PEPE: { symbol: 'PEPE', fallbackPrice: 0.0000085 },
  BONK: { symbol: 'BONK', fallbackPrice: 0.000018 },
};

// Symbol to CoinGecko ID mapping for direct fallback
const SYMBOL_TO_GECKO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  MATIC: 'matic-network',
  POL: 'matic-network',
  ARB: 'arbitrum',
  OP: 'optimism',
  AVAX: 'avalanche-2',
  STRK: 'starknet',
  UNI: 'uniswap',
  AAVE: 'aave',
  LINK: 'chainlink',
  CRV: 'curve-dao-token',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  DOGE: 'dogecoin',
  SHIB: 'shiba-inu',
  PEPE: 'pepe',
  BONK: 'bonk',
};

const LOCAL_CACHE_KEY = 'historical_prices_cache_v3';
const LOCAL_CACHE_TTL = 10 * 60 * 1000;

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

const getTokenConfig = (symbol: string): TokenConfig | undefined => {
  const upperSymbol = symbol.toUpperCase();
  return TOKEN_CONFIG[upperSymbol];
};

const getTimeframeDays = (timeframe: Timeframe): string => {
  switch (timeframe) {
    case '1H': return '1';      // Fetch 1 day, filter client-side to last 60 minutes
    case '1D': return '1';      // Full 24 hours
    case '1W': return '7';
    case '1M': return '30';
    case '1Y': return '365';    // Last 365 days
    case 'ALL': return '365';   // Max available on free CoinGecko API (365 days)
    default: return '1';
  }
};

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
    const cacheKey = `coingecko-${coinSymbol}-${days}`;

    // Check local cache first
    const cached = readLocalCache(cacheKey);
    if (cached && cached.length > 0) {
      setData(cached);
      setLoading(false);
      setIsLiveData(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let prices: [number, number][] | null = null;
      let wasLive = true;

      // Try backend proxy first
      try {
        const { data: result, error: fnError } = await supabase.functions.invoke('coingecko-history', {
          body: { coinId: coinSymbol, days },
        });
        if (!fnError && result?.prices && Array.isArray(result.prices)) {
          prices = result.prices;
          wasLive = !result.cached || !result.stale;
        }
      } catch (proxyErr) {
        console.warn('Backend proxy failed, trying direct CoinGecko:', proxyErr);
      }

      // Fallback: direct CoinGecko call
      if (!prices) {
        const geckoId = SYMBOL_TO_GECKO_ID[coinSymbol.toUpperCase()] || coinSymbol.toLowerCase();
        const url = new URL(`https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart`);
        url.searchParams.set('vs_currency', 'usd');
        url.searchParams.set('days', days === 'max' ? '365' : days);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
        const json = await res.json();
        prices = json.prices;
        wasLive = true;
      }

      if (!prices || !Array.isArray(prices)) {
        throw new Error('Invalid data format');
      }

      // For 1H, filter to last hour from the fetched data
      if (timeframe === '1H' && prices.length > 0) {
        // Use the last timestamp in the data as reference (more reliable than Date.now())
        const lastTimestamp = prices[prices.length - 1][0];
        const oneHourAgo = lastTimestamp - (60 * 60 * 1000);
        prices = prices.filter(([timestamp]) => timestamp >= oneHourAgo);
      }

      // Adjust sampling based on timeframe for optimal chart display
      let maxPoints: number;
      switch (timeframe) {
        case '1H': maxPoints = 12; break;   // ~5 min intervals
        case '1D': maxPoints = 24; break;   // ~1 hour intervals  
        case '1W': maxPoints = 28; break;   // ~6 hour intervals
        case '1M': maxPoints = 30; break;   // ~1 day intervals
        case '1Y': maxPoints = 52; break;   // ~1 week intervals
        case 'ALL': maxPoints = 120; break; // More points for full history
        default: maxPoints = 24;
      }

      const step = Math.max(1, Math.floor(prices.length / maxPoints));
      const sampledPrices = prices.filter((_, index) => index % step === 0);

      const formattedData: PricePoint[] = sampledPrices.map(([timestamp, price]) => ({
        timestamp,
        time: formatTime(timestamp, timeframe),
        price: price < 0.01 ? parseFloat(price.toPrecision(4)) : parseFloat(price.toFixed(2)),
      }));

      setData(formattedData);
      setIsLiveData(wasLive);
      writeLocalCache(cacheKey, formattedData);
    } catch (err) {
      console.error('Error fetching historical prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsLiveData(false);
      
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
