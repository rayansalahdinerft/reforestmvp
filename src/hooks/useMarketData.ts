import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MarketToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] } | null;
  market_cap?: number;
  total_volume?: number;
}

interface MarketDataResult {
  tokens: MarketToken[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = 'market_data_cache_coingecko_v1';
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// CoinGecko IDs (used for market data + sparkline 7D)
const TOKEN_IDS = [
  // Major
  'bitcoin', 'ethereum', 'binancecoin', 'solana',
  // Layer 2
  'matic-network', 'arbitrum', 'optimism', 'avalanche-2', 'starknet',
  // DeFi
  'uniswap', 'aave', 'chainlink', 'curve-dao-token',
  // Stablecoins
  'usd-coin', 'tether', 'dai',
  // Meme
  'dogecoin', 'shiba-inu', 'pepe', 'bonk',
];

// Category mapping
export const TOKEN_CATEGORIES: Record<string, string> = {
  bitcoin: 'Major',
  ethereum: 'Major',
  binancecoin: 'Major',
  solana: 'Major',
  'matic-network': 'Layer 2',
  arbitrum: 'Layer 2',
  optimism: 'Layer 2',
  'avalanche-2': 'Layer 2',
  starknet: 'Layer 2',
  uniswap: 'DeFi',
  aave: 'DeFi',
  chainlink: 'DeFi',
  'curve-dao-token': 'DeFi',
  'usd-coin': 'Stablecoin',
  tether: 'Stablecoin',
  dai: 'Stablecoin',
  dogecoin: 'Meme',
  'shiba-inu': 'Meme',
  pepe: 'Meme',
  bonk: 'Meme',
};

interface CacheData {
  ts: number;
  tokens: MarketToken[];
}

const readCache = (): MarketToken[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheData;
    if (!parsed?.ts || !parsed?.tokens) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.tokens;
  } catch {
    return null;
  }
};

const writeCache = (tokens: MarketToken[]) => {
  try {
    const payload: CacheData = { ts: Date.now(), tokens };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
};

export const useMarketData = (): MarketDataResult => {
  const [tokens, setTokens] = useState<MarketToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Use cache first to avoid blank state
    const cached = readCache();
    if (cached && cached.length > 0) {
      setTokens(cached);
      setLoading(false);
    }

    try {
      // Fetch market data + 7D sparklines from backend proxy
      const { data: result, error: fnError } = await supabase.functions.invoke('coingecko-markets', {
        body: { ids: TOKEN_IDS },
      });

      if (fnError) throw fnError;
      
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format');
      }

      // CoinGecko already matches our MarketToken shape closely
      const formattedTokens: MarketToken[] = result.data.map((token: any) => ({
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        image: token.image,
        current_price: token.current_price ?? 0,
        price_change_percentage_24h: token.price_change_percentage_24h ?? 0,
        sparkline_in_7d: token.sparkline_in_7d ?? null,
        market_cap: token.market_cap ?? 0,
        total_volume: token.total_volume ?? 0,
      }));

      setTokens(formattedTokens);
      writeCache(formattedTokens);
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      
      // Keep existing data or cached data (avoid fake numbers)
      setTokens(prev => {
        if (prev.length > 0) return prev;
        const cached = readCache();
        if (cached && cached.length > 0) return cached;
        return [];
      });
      
      setError('Market data temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { tokens, loading, error, refetch: fetchData };
};

export default useMarketData;
