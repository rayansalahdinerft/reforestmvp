import { useState, useEffect, useCallback } from 'react';

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

const CACHE_KEY = 'market_data_cache_v1';
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

// Token IDs for CoinGecko /coins/markets endpoint
const COINGECKO_IDS = [
  // Major
  'bitcoin', 'ethereum', 'binancecoin', 'solana',
  // Layer 2
  'matic-network', 'arbitrum', 'optimism', 'avalanche-2',
  // DeFi
  'uniswap', 'aave', 'chainlink', 'curve-dao-token',
  // Stablecoins
  'usd-coin', 'tether', 'dai',
  // Meme
  'dogecoin', 'shiba-inu', 'pepe', 'bonk',
  // Starknet
  'starknet',
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
  starknet: 'Layer 2',
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

// Fallback data when API fails
const FALLBACK_DATA: MarketToken[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', current_price: 95000, price_change_percentage_24h: 0, sparkline_in_7d: null },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price: 2900, price_change_percentage_24h: 0, sparkline_in_7d: null },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', current_price: 120, price_change_percentage_24h: 0, sparkline_in_7d: null },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', current_price: 650, price_change_percentage_24h: 0, sparkline_in_7d: null },
  { id: 'starknet', symbol: 'strk', name: 'Starknet', image: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png', current_price: 0.5, price_change_percentage_24h: 0, sparkline_in_7d: null },
];

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
      const ids = COINGECKO_IDS.join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: MarketToken[] = await response.json();
      setTokens(data);
      writeCache(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      
      // Keep existing data or use fallback
      setTokens(prev => {
        if (prev.length > 0) return prev;
        const cached = readCache();
        if (cached && cached.length > 0) return cached;
        return FALLBACK_DATA;
      });
      
      setError('Market data temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Refresh every 2 minutes (reduce rate limiting)
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { tokens, loading, error, refetch: fetchData };
};

export default useMarketData;
