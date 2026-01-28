import { useState, useEffect, useCallback } from 'react';

interface PriceData {
  [tokenId: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

// CoinGecko IDs for common tokens
const TOKEN_COINGECKO_IDS: Record<string, string> = {
  // Ethereum & ERC20
  ETH: 'ethereum',
  WETH: 'weth',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  WBTC: 'wrapped-bitcoin',
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
        throw new Error('Failed to fetch prices');
      }

      const data = await response.json();
      setPrices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching prices:', err);
      setError('Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    fetchPrices();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
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
