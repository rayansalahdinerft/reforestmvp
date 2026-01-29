import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  [tokenId: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

type PriceCache = {
  ts: number;
  prices: PriceData;
};

const PRICE_CACHE_KEY = 'token_prices_cache_v1';
const PRICE_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes
const REFRESH_INTERVAL_MS = 60 * 1000; // 60 seconds (reduce rate limiting)

// Minimal fallback USD prices to avoid displaying 0 when API is temporarily unavailable
const FALLBACK_USD_BY_ID: Record<string, number> = {
  bitcoin: 95000,
  ethereum: 2900,
  solana: 120,
  binancecoin: 650,
  'usd-coin': 1,
  tether: 1,
  'matic-network': 0.5,
  arbitrum: 0.8,
  optimism: 1.5,
  'avalanche-2': 25,
};

const readCachedPrices = (): PriceData | null => {
  try {
    const raw = localStorage.getItem(PRICE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PriceCache;
    if (!parsed?.ts || !parsed?.prices) return null;
    if (Date.now() - parsed.ts > PRICE_CACHE_TTL_MS) return null;
    return parsed.prices;
  } catch {
    return null;
  }
};

const writeCachedPrices = (prices: PriceData) => {
  try {
    const payload: PriceCache = { ts: Date.now(), prices };
    localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache write errors
  }
};

// CoinGecko IDs for common tokens
const TOKEN_COINGECKO_IDS: Record<string, string> = {
  // Bitcoin
  BTC: 'bitcoin',
  // Ethereum & ERC20
  ETH: 'ethereum',
  WETH: 'weth',
  WBTC: 'wrapped-bitcoin',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  stETH: 'staked-ether',
  rETH: 'rocket-pool-eth',
  cbETH: 'coinbase-wrapped-staked-eth',
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
  MKR: 'maker',
  LDO: 'lido-dao',
  CRV: 'curve-dao-token',
  PEPE: 'pepe',
  SHIB: 'shiba-inu',
  // Polygon
  MATIC: 'matic-network',
  POL: 'matic-network',
  QUICK: 'quickswap',
  // Arbitrum
  ARB: 'arbitrum',
  GMX: 'gmx',
  PENDLE: 'pendle',
  RDNT: 'radiant-capital',
  GNS: 'gains-network',
  // Optimism
  OP: 'optimism',
  SNX: 'havven',
  VELO: 'velodrome-finance',
  // Base
  AERO: 'aerodrome-finance',
  // Avalanche
  AVAX: 'avalanche-2',
  JOE: 'joe',
  // BNB Chain
  BNB: 'binancecoin',
  CAKE: 'pancakeswap-token',
  XVS: 'venus',
  BUSD: 'binance-usd',
  DOGE: 'dogecoin',
  FLOKI: 'floki',
  // Solana
  SOL: 'solana',
  RAY: 'raydium',
  ORCA: 'orca',
  BONK: 'bonk',
  JTO: 'jito-governance-token',
  JUP: 'jupiter-exchange-solana',
  mSOL: 'msol',
  jitoSOL: 'jito-staked-sol',
};

export const useTokenPrices = (symbols: string[] = []) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      // Fast path: use cache immediately to avoid flashing 0s
      const cached = readCachedPrices();
      if (cached && Object.keys(cached).length > 0) {
        setPrices((prev) => ({ ...cached, ...prev }));
        setLoading(false);
      }

      // Get unique CoinGecko IDs
      const ids = [...new Set(
        symbols
          .map(s => TOKEN_COINGECKO_IDS[s.toUpperCase()])
          .filter(Boolean)
      )];

      if (ids.length === 0) {
        // Fetch popular tokens by default
        const defaultIds = ['ethereum', 'bitcoin', 'usd-coin', 'tether', 'solana', 'matic-network', 'arbitrum', 'optimism', 'avalanche-2', 'binancecoin'];
        ids.push(...defaultIds);
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch prices (HTTP ${response.status})`);
      }

      const data = await response.json();
      setPrices(data);
      writeCachedPrices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching prices:', err);

      // If API is temporarily unavailable / rate-limited, avoid showing 0 by keeping
      // previous values or falling back to realistic defaults.
      setPrices((prev) => {
        if (Object.keys(prev).length > 0) return prev;

        const requestedIds = [...new Set(
          symbols
            .map(s => TOKEN_COINGECKO_IDS[s.toUpperCase()])
            .filter(Boolean)
        )];

        const idsToUse = requestedIds.length > 0
          ? requestedIds
          : ['ethereum', 'bitcoin', 'usd-coin', 'tether', 'solana', 'matic-network', 'arbitrum', 'optimism', 'avalanche-2', 'binancecoin'];

        const fallback: PriceData = {};
        for (const id of idsToUse) {
          fallback[id] = {
            usd: FALLBACK_USD_BY_ID[id] ?? 100,
            usd_24h_change: 0,
          };
        }
        return fallback;
      });

      setError('Prix indisponibles (limite API / réseau)');
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    fetchPrices();
    
    // Refresh every 60 seconds (reduce rate limiting)
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const getPrice = useCallback((symbol: string): number | null => {
    const id = TOKEN_COINGECKO_IDS[symbol.toUpperCase()];
    if (!id || !prices[id]) return null;
    return prices[id].usd;
  }, [prices]);

  const get24hChange = useCallback((symbol: string): number | null => {
    const id = TOKEN_COINGECKO_IDS[symbol.toUpperCase()];
    if (!id || !prices[id]) return null;
    return prices[id].usd_24h_change || null;
  }, [prices]);

  return { prices, loading, error, getPrice, get24hChange, refetch: fetchPrices };
};

export const TOKEN_COINGECKO_MAP = TOKEN_COINGECKO_IDS;
