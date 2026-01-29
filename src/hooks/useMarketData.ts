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

// Fallback data when API fails - all tokens
const FALLBACK_DATA: MarketToken[] = [
  // Major
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', current_price: 87000, price_change_percentage_24h: -2.1, sparkline_in_7d: null, market_cap: 1720000000000, total_volume: 45000000000 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price: 2400, price_change_percentage_24h: -1.8, sparkline_in_7d: null, market_cap: 290000000000, total_volume: 18000000000 },
  { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', current_price: 620, price_change_percentage_24h: -1.2, sparkline_in_7d: null, market_cap: 92000000000, total_volume: 1200000000 },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', current_price: 135, price_change_percentage_24h: -3.5, sparkline_in_7d: null, market_cap: 65000000000, total_volume: 4500000000 },
  // Layer 2
  { id: 'matic-network', symbol: 'matic', name: 'Polygon', image: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png', current_price: 0.42, price_change_percentage_24h: -2.8, sparkline_in_7d: null, market_cap: 4200000000, total_volume: 280000000 },
  { id: 'arbitrum', symbol: 'arb', name: 'Arbitrum', image: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg', current_price: 0.55, price_change_percentage_24h: -4.2, sparkline_in_7d: null, market_cap: 2200000000, total_volume: 320000000 },
  { id: 'optimism', symbol: 'op', name: 'Optimism', image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png', current_price: 1.25, price_change_percentage_24h: -3.1, sparkline_in_7d: null, market_cap: 1500000000, total_volume: 180000000 },
  { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png', current_price: 22, price_change_percentage_24h: -2.5, sparkline_in_7d: null, market_cap: 9000000000, total_volume: 450000000 },
  { id: 'starknet', symbol: 'strk', name: 'Starknet', image: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png', current_price: 0.38, price_change_percentage_24h: -5.2, sparkline_in_7d: null, market_cap: 780000000, total_volume: 85000000 },
  // DeFi
  { id: 'uniswap', symbol: 'uni', name: 'Uniswap', image: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png', current_price: 7.80, price_change_percentage_24h: -2.9, sparkline_in_7d: null, market_cap: 4700000000, total_volume: 220000000 },
  { id: 'aave', symbol: 'aave', name: 'Aave', image: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png', current_price: 185, price_change_percentage_24h: -1.5, sparkline_in_7d: null, market_cap: 2800000000, total_volume: 180000000 },
  { id: 'chainlink', symbol: 'link', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', current_price: 14.50, price_change_percentage_24h: -2.2, sparkline_in_7d: null, market_cap: 9000000000, total_volume: 520000000 },
  { id: 'curve-dao-token', symbol: 'crv', name: 'Curve DAO', image: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png', current_price: 0.52, price_change_percentage_24h: -3.8, sparkline_in_7d: null, market_cap: 650000000, total_volume: 85000000 },
  // Stablecoins
  { id: 'usd-coin', symbol: 'usdc', name: 'USD Coin', image: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png', current_price: 1.00, price_change_percentage_24h: 0.01, sparkline_in_7d: null, market_cap: 45000000000, total_volume: 8500000000 },
  { id: 'tether', symbol: 'usdt', name: 'Tether', image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', current_price: 1.00, price_change_percentage_24h: 0.02, sparkline_in_7d: null, market_cap: 95000000000, total_volume: 65000000000 },
  { id: 'dai', symbol: 'dai', name: 'Dai', image: 'https://assets.coingecko.com/coins/images/9956/small/4943.png', current_price: 1.00, price_change_percentage_24h: -0.01, sparkline_in_7d: null, market_cap: 5300000000, total_volume: 320000000 },
  // Meme
  { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', current_price: 0.18, price_change_percentage_24h: -4.5, sparkline_in_7d: null, market_cap: 27000000000, total_volume: 2200000000 },
  { id: 'shiba-inu', symbol: 'shib', name: 'Shiba Inu', image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png', current_price: 0.0000125, price_change_percentage_24h: -5.2, sparkline_in_7d: null, market_cap: 7400000000, total_volume: 420000000 },
  { id: 'pepe', symbol: 'pepe', name: 'Pepe', image: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg', current_price: 0.0000085, price_change_percentage_24h: -6.8, sparkline_in_7d: null, market_cap: 3600000000, total_volume: 850000000 },
  { id: 'bonk', symbol: 'bonk', name: 'Bonk', image: 'https://assets.coingecko.com/coins/images/28600/small/bonk.jpg', current_price: 0.000018, price_change_percentage_24h: -7.2, sparkline_in_7d: null, market_cap: 1200000000, total_volume: 180000000 },
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
