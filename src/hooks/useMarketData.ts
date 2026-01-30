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

const CACHE_KEY = 'market_data_cache_coincodex_v1';
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

// Token symbols for CoinCodex API
const TOKEN_SYMBOLS = [
  // Major
  'BTC', 'ETH', 'BNB', 'SOL',
  // Layer 2
  'MATIC', 'ARB', 'OP', 'AVAX', 'STRK',
  // DeFi
  'UNI', 'AAVE', 'LINK', 'CRV',
  // Stablecoins
  'USDC', 'USDT', 'DAI',
  // Meme
  'DOGE', 'SHIB', 'PEPE', 'BONK',
];

// Category mapping
export const TOKEN_CATEGORIES: Record<string, string> = {
  btc: 'Major',
  eth: 'Major',
  bnb: 'Major',
  sol: 'Major',
  matic: 'Layer 2',
  arb: 'Layer 2',
  op: 'Layer 2',
  avax: 'Layer 2',
  strk: 'Layer 2',
  uni: 'DeFi',
  aave: 'DeFi',
  link: 'DeFi',
  crv: 'DeFi',
  usdc: 'Stablecoin',
  usdt: 'Stablecoin',
  dai: 'Stablecoin',
  doge: 'Meme',
  shib: 'Meme',
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

// Fallback data when API fails
const FALLBACK_DATA: MarketToken[] = [
  { id: 'btc', symbol: 'btc', name: 'Bitcoin', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/b9469e27-476b-4fc8-0d5e-9a9e51581400/coin64', current_price: 82000, price_change_percentage_24h: -6.2, sparkline_in_7d: null, market_cap: 1620000000000, total_volume: 85000000000 },
  { id: 'eth', symbol: 'eth', name: 'Ethereum', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/6e6e4e74-e3de-43b5-6b30-ed41e9b95c00/coin64', current_price: 2740, price_change_percentage_24h: -7.4, sparkline_in_7d: null, market_cap: 330000000000, total_volume: 45000000000 },
  { id: 'bnb', symbol: 'bnb', name: 'BNB', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/bb3c5cc2-f5f8-49f9-4a00-3de50c0a2a00/coin64', current_price: 596, price_change_percentage_24h: -5.8, sparkline_in_7d: null, market_cap: 90000000000, total_volume: 1500000000 },
  { id: 'sol', symbol: 'sol', name: 'Solana', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/7d7eb3e9-2f2c-4f46-0d00-3e8e96fa8b00/coin64', current_price: 115, price_change_percentage_24h: -6.7, sparkline_in_7d: null, market_cap: 58000000000, total_volume: 5000000000 },
  { id: 'matic', symbol: 'pol', name: 'Polygon', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/polygon-coin/coin64', current_price: 0.20, price_change_percentage_24h: -8.5, sparkline_in_7d: null, market_cap: 2000000000, total_volume: 200000000 },
  { id: 'arb', symbol: 'arb', name: 'Arbitrum', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/arbitrum-coin/coin64', current_price: 0.15, price_change_percentage_24h: -7.5, sparkline_in_7d: null, market_cap: 600000000, total_volume: 100000000 },
  { id: 'op', symbol: 'op', name: 'Optimism', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/optimism-coin/coin64', current_price: 0.26, price_change_percentage_24h: -8.3, sparkline_in_7d: null, market_cap: 300000000, total_volume: 50000000 },
  { id: 'avax', symbol: 'avax', name: 'Avalanche', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/avalanche-coin/coin64', current_price: 11, price_change_percentage_24h: -7.6, sparkline_in_7d: null, market_cap: 4500000000, total_volume: 300000000 },
  { id: 'strk', symbol: 'strk', name: 'Starknet', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/starknet-coin/coin64', current_price: 0.14, price_change_percentage_24h: -9.2, sparkline_in_7d: null, market_cap: 300000000, total_volume: 30000000 },
  { id: 'uni', symbol: 'uni', name: 'Uniswap', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/uniswap-coin/coin64', current_price: 5.50, price_change_percentage_24h: -6.9, sparkline_in_7d: null, market_cap: 3300000000, total_volume: 150000000 },
  { id: 'aave', symbol: 'aave', name: 'Aave', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/aave-coin/coin64', current_price: 165, price_change_percentage_24h: -5.5, sparkline_in_7d: null, market_cap: 2500000000, total_volume: 150000000 },
  { id: 'link', symbol: 'link', name: 'Chainlink', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/chainlink-coin/coin64', current_price: 13, price_change_percentage_24h: -6.2, sparkline_in_7d: null, market_cap: 8000000000, total_volume: 400000000 },
  { id: 'crv', symbol: 'crv', name: 'Curve DAO', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/curve-coin/coin64', current_price: 0.42, price_change_percentage_24h: -7.8, sparkline_in_7d: null, market_cap: 500000000, total_volume: 60000000 },
  { id: 'usdc', symbol: 'usdc', name: 'USD Coin', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/usdc-coin/coin64', current_price: 1.00, price_change_percentage_24h: 0.01, sparkline_in_7d: null, market_cap: 45000000000, total_volume: 8500000000 },
  { id: 'usdt', symbol: 'usdt', name: 'Tether', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/tether-coin/coin64', current_price: 1.00, price_change_percentage_24h: 0.02, sparkline_in_7d: null, market_cap: 95000000000, total_volume: 65000000000 },
  { id: 'dai', symbol: 'dai', name: 'Dai', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/dai-coin/coin64', current_price: 1.00, price_change_percentage_24h: -0.01, sparkline_in_7d: null, market_cap: 5300000000, total_volume: 320000000 },
  { id: 'doge', symbol: 'doge', name: 'Dogecoin', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/doge-coin/coin64', current_price: 0.16, price_change_percentage_24h: -8.5, sparkline_in_7d: null, market_cap: 24000000000, total_volume: 2000000000 },
  { id: 'shib', symbol: 'shib', name: 'Shiba Inu', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/shiba-coin/coin64', current_price: 0.0000115, price_change_percentage_24h: -9.2, sparkline_in_7d: null, market_cap: 6800000000, total_volume: 380000000 },
  { id: 'pepe', symbol: 'pepe', name: 'Pepe', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/pepe-coin/coin64', current_price: 0.0000075, price_change_percentage_24h: -10.8, sparkline_in_7d: null, market_cap: 3100000000, total_volume: 700000000 },
  { id: 'bonk', symbol: 'bonk', name: 'Bonk', image: 'https://imagedelivery.net/4-5JC1r3VHAXpnrwWHBHRQ/bonk-coin/coin64', current_price: 0.000015, price_change_percentage_24h: -11.2, sparkline_in_7d: null, market_cap: 1000000000, total_volume: 150000000 },
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
      // Call CoinCodex edge function
      const { data: result, error: fnError } = await supabase.functions.invoke('coincodex-markets', {
        body: { symbols: TOKEN_SYMBOLS },
      });

      if (fnError) throw fnError;
      
      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Invalid data format');
      }

      // Transform to our format and add image URLs
      const formattedTokens: MarketToken[] = result.data.map((token: any) => ({
        id: token.id || token.symbol?.toLowerCase(),
        symbol: token.symbol?.toLowerCase() || token.id,
        name: token.name,
        image: token.image || `https://coincodex.com/images/coins/${token.symbol?.toLowerCase()}.png`,
        current_price: token.current_price || 0,
        price_change_percentage_24h: token.price_change_percentage_24h || 0,
        sparkline_in_7d: null, // CoinCodex doesn't include sparkline in market data
        market_cap: token.market_cap || 0,
        total_volume: token.total_volume || 0,
      }));

      setTokens(formattedTokens);
      writeCache(formattedTokens);
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
    
    // Refresh every 2 minutes
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { tokens, loading, error, refetch: fetchData };
};

export default useMarketData;
