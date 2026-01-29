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
  ethereum: 2900,
  weth: 2900,
  'wrapped-bitcoin': 95000,
  'usd-coin': 1,
  tether: 1,
  dai: 1,
  // LST
  'staked-ether': 2900,
  'wrapped-steth': 3300,
  'rocket-pool-eth': 3200,
  // DeFi
  chainlink: 15,
  uniswap: 7,
  aave: 180,
  maker: 1500,
  'lido-dao': 1.5,
  'curve-dao-token': 0.5,
  // L2
  arbitrum: 0.8,
  optimism: 1.5,
  'matic-network': 0.5,
  // Memecoins
  pepe: 0.000012,
  'shiba-inu': 0.000015,
  dogecoin: 0.25,
  floki: 0.00015,
  bonk: 0.00002,
  dogwifcoin: 1.5,
  'mog-coin': 0.000002,
  turbo: 0.008,
  'dogelon-mars': 0.0000002,
  spx6900: 0.8,
  // AI
  'fetch-ai': 1.5,
  'render-token': 7,
  bittensor: 400,
  'worldcoin-wld': 2,
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
  // Native & Wrapped
  ETH: 'ethereum',
  WETH: 'weth',
  WBTC: 'wrapped-bitcoin',
  
  // Stablecoins
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  FRAX: 'frax',
  LUSD: 'liquity-usd',
  TUSD: 'true-usd',
  GUSD: 'gemini-dollar',
  USDP: 'paxos-standard',
  sUSD: 'nusd',
  
  // LST & LRT
  stETH: 'staked-ether',
  wstETH: 'wrapped-steth',
  rETH: 'rocket-pool-eth',
  cbETH: 'coinbase-wrapped-staked-eth',
  swETH: 'sweth',
  ETHx: 'stader-ethx',
  ankrETH: 'ankr-staked-eth',
  sfrxETH: 'staked-frax-ether',
  mETH: 'mantle-staked-ether',
  eETH: 'ether-fi-staked-eth',
  weETH: 'wrapped-eeth',
  rsETH: 'kelp-dao-restaked-eth',
  ezETH: 'renzo-restaked-eth',
  pufETH: 'pufeth',
  
  // DeFi Blue Chips
  LINK: 'chainlink',
  UNI: 'uniswap',
  AAVE: 'aave',
  MKR: 'maker',
  LDO: 'lido-dao',
  CRV: 'curve-dao-token',
  SNX: 'havven',
  COMP: 'compound-governance-token',
  YFI: 'yearn-finance',
  SUSHI: 'sushi',
  '1INCH': '1inch',
  BAL: 'balancer',
  DYDX: 'dydx',
  ENS: 'ethereum-name-service',
  RPL: 'rocket-pool',
  CVX: 'convex-finance',
  FXS: 'frax-share',
  PENDLE: 'pendle',
  GNO: 'gnosis',
  INST: 'instadapp',
  EIGEN: 'eigenlayer',
  ENA: 'ethena',
  MORPHO: 'morpho',
  
  // Layer 2
  ARB: 'arbitrum',
  OP: 'optimism',
  MATIC: 'matic-network',
  IMX: 'immutable-x',
  LRC: 'loopring',
  METIS: 'metis-token',
  MANTA: 'manta-network',
  STRK: 'starknet',
  ZK: 'zksync',
  BLAST: 'blast',
  MODE: 'mode',
  SCROLL: 'scroll',
  
  // Memecoins - Top tier
  PEPE: 'pepe',
  SHIB: 'shiba-inu',
  DOGE: 'dogecoin',
  FLOKI: 'floki',
  BONK: 'bonk',
  WIF: 'dogwifcoin',
  MOG: 'mog-coin',
  TURBO: 'turbo',
  WOJAK: 'wojak',
  ANDY: 'andy-eth',
  ELON: 'dogelon-mars',
  BABYDOGE: 'baby-doge-coin',
  KISHU: 'kishu-inu',
  HOGE: 'hoge-finance',
  CULT: 'cult-dao',
  BONE: 'bone-shibaswap',
  LEASH: 'doge-killer',
  AKITA: 'akita-inu',
  
  // New Memecoins 2024
  SPX: 'spx6900',
  GIGA: 'giga-protocol',
  PONKE: 'ponke',
  MICHI: 'michi',
  POPCAT: 'popcat',
  BRETT: 'based-brett',
  TOSHI: 'toshi',
  DEGEN: 'degen-base',
  HIGHER: 'higher',
  MFER: 'mfercoin',
  
  // AI & Compute tokens
  FET: 'fetch-ai',
  RNDR: 'render-token',
  AGIX: 'singularitynet',
  OCEAN: 'ocean-protocol',
  TAO: 'bittensor',
  AKT: 'akash-network',
  AR: 'arweave',
  FIL: 'filecoin',
  GRT: 'the-graph',
  LPT: 'livepeer',
  PRIME: 'echelon-prime',
  NMR: 'numeraire',
  OLAS: 'autonolas',
  RSS3: 'rss3',
  AIOZ: 'aioz-network',
  WLD: 'worldcoin-wld',
  
  // Gaming & Metaverse
  APE: 'apecoin',
  SAND: 'the-sandbox',
  MANA: 'decentraland',
  AXS: 'axie-infinity',
  GALA: 'gala',
  ILV: 'illuvium',
  BLUR: 'blur',
  LOOKS: 'looksrare',
  X2Y2: 'x2y2',
  RARE: 'superrare',
  
  // Other popular
  GNS: 'gains-network',
  RDNT: 'radiant-capital',
  GMX: 'gmx',
  MAGIC: 'magic',
  STG: 'stargate-finance',
  ETHFI: 'ether-fi',
  ALT: 'altlayer',
  W: 'wormhole',
  JUP: 'jupiter-exchange-solana',
  PYTH: 'pyth-network',
};

export const useTokenPrices = (symbols: string[] = []) => {
  const [prices, setPrices] = useState<PriceData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stabilize symbols array to prevent infinite re-renders
  const symbolsKey = symbols.sort().join(',');

  useEffect(() => {
    let isMounted = true;

    const fetchPrices = async () => {
      try {
        // Fast path: use cache immediately to avoid flashing 0s
        const cached = readCachedPrices();
        if (cached && Object.keys(cached).length > 0 && isMounted) {
          setPrices(cached);
          setLoading(false);
        }

        // Get unique CoinGecko IDs from current symbols
        const currentSymbols = symbolsKey ? symbolsKey.split(',') : [];
        const ids = [...new Set(
          currentSymbols
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
        if (isMounted) {
          setPrices(data);
          writeCachedPrices(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching prices:', err);

        if (isMounted) {
          // If API is temporarily unavailable / rate-limited, avoid showing 0 by keeping
          // previous values or falling back to realistic defaults.
          setPrices((prev) => {
            if (Object.keys(prev).length > 0) return prev;

            const currentSymbols = symbolsKey ? symbolsKey.split(',') : [];
            const requestedIds = [...new Set(
              currentSymbols
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
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrices();
    
    // Refresh every 60 seconds (reduce rate limiting)
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL_MS);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbolsKey]);

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

  return { prices, loading, error, getPrice, get24hChange };
};

export const TOKEN_COINGECKO_MAP = TOKEN_COINGECKO_IDS;
