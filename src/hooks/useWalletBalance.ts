import { useState, useEffect, useCallback, useRef } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { createPublicClient, http, formatUnits, formatEther } from 'viem';
import { mainnet } from 'viem/chains';
import { supabase } from '@/integrations/supabase/client';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: number;
  logoURI?: string;
  price: number;
}

// ERC20 tokens to check on Ethereum mainnet
const ERC20_TOKENS = [
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as `0x${string}`,
    decimals: 8,
    logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png',
    coingeckoId: 'wrapped-bitcoin',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`,
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
    coingeckoId: 'usd-coin',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    coingeckoId: 'tether',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    coingeckoId: 'ethereum',
  },
  {
    symbol: 'SOL',
    name: 'Wrapped SOL',
    address: '0xD31a59c85aE9D8edEFec411186ADc5Ddf0d5a513' as `0x${string}`,
    decimals: 9,
    logoURI: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    coingeckoId: 'solana',
  },
  {
    symbol: 'BNB',
    name: 'Binance Coin',
    address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    coingeckoId: 'binancecoin',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png',
    coingeckoId: 'chainlink',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png',
    coingeckoId: 'uniswap',
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png',
    coingeckoId: 'aave',
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    coingeckoId: 'dai',
  },
  {
    symbol: 'PEPE',
    name: 'Pepe',
    address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
    coingeckoId: 'pepe',
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' as `0x${string}`,
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.png',
    coingeckoId: 'shiba-inu',
  },
];

// Cache for ETH price to avoid repeated API calls
let cachedPrices: Record<string, number> = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

// ERC20 balanceOf ABI encoded function
const BALANCE_OF_SELECTOR = '0x70a08231';

export const useWalletBalance = (overrideAddress?: string | null) => {
  const { address: connectedAddress, isConnected, chainId } = useWallet();
  const address = overrideAddress ?? connectedAddress;
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const fetchingRef = useRef(false);

  // Native ETH balance state
  const [nativeBalanceWei, setNativeBalanceWei] = useState<bigint>(0n);

  const fetchNativeBalance = useCallback(async () => {
    if (!address) return;
    try {
      const publicClient = createPublicClient({ chain: mainnet, transport: http() });
      const bal = await publicClient.getBalance({ address: address as `0x${string}` });
      setNativeBalanceWei(bal);
    } catch (e) {
      console.error('Error fetching native balance:', e);
    }
  }, [address]);

  const fetchPrices = async (): Promise<Record<string, number>> => {
    // Check cache first
    const now = Date.now();
    if (Object.keys(cachedPrices).length > 0 && now - cacheTimestamp < CACHE_DURATION) {
      return cachedPrices;
    }

    const ids = [...new Set(ERC20_TOKENS.map(t => t.coingeckoId).concat('ethereum'))];
    
    // Try CoinGecko API directly first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const priceRes = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        const prices: Record<string, number> = {};
        for (const id of ids) {
          prices[id] = priceData[id]?.usd || (id === 'usd-coin' || id === 'tether' || id === 'dai' ? 1 : 0);
        }
        cachedPrices = prices;
        cacheTimestamp = now;
        return prices;
      }
    } catch (e) {
      console.log('CoinGecko direct API failed, trying edge function...');
    }

    // Fallback to edge function
    try {
      const { data, error } = await supabase.functions.invoke('coingecko-markets', {
        body: { ids }
      });

      if (!error && Array.isArray(data?.data) && data.data.length > 0) {
        const prices: Record<string, number> = {};
        for (const coin of data.data) {
          prices[coin.id] = coin.current_price;
        }
        cachedPrices = prices;
        cacheTimestamp = now;
        return prices;
      }
    } catch (e) {
      console.error('Edge function fallback failed:', e);
    }

    // Return cached or default prices
    return cachedPrices.ethereum ? cachedPrices : { ethereum: 0, 'usd-coin': 1, tether: 1 };
  };

  const fetchERC20Balance = async (
    tokenAddress: `0x${string}`,
    userAddress: `0x${string}`,
    decimals: number
  ): Promise<string> => {
    try {
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http()
      });

      const paddedAddress = userAddress.slice(2).toLowerCase().padStart(64, '0');
      const data = `${BALANCE_OF_SELECTOR}${paddedAddress}` as `0x${string}`;

      const result = await publicClient.call({
        to: tokenAddress,
        data,
      });

      if (result.data) {
        const balance = BigInt(result.data);
        return formatUnits(balance, decimals);
      }
      return '0';
    } catch (e) {
      console.error('Error fetching ERC20 balance:', e);
      return '0';
    }
  };

  const fetchBalances = useCallback(async () => {
    if (!isConnected || !address) {
      setBalances([]);
      setTotalValue(0);
      return;
    }

    // Prevent concurrent fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    setLoading(true);
    setPriceError(false);

    try {
      // Fetch prices
      const prices = await fetchPrices();
      const ethPrice = prices.ethereum || 0;
      
      if (ethPrice === 0) {
        setPriceError(true);
      }

      // Format native ETH balance
      const ethBalance = nativeBalance 
        ? Number(nativeBalance.value) / Math.pow(10, nativeBalance.decimals) 
        : 0;
      const ethBalanceUsd = ethBalance * ethPrice;

      const tokenBalances: TokenBalance[] = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance.toFixed(6),
          balanceUsd: ethBalanceUsd,
          logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
          price: ethPrice,
        },
      ];

      // Fetch ERC20 balances in parallel
      const erc20Promises = ERC20_TOKENS.map(async (token) => {
        const balance = await fetchERC20Balance(
          token.address,
          address as `0x${string}`,
          token.decimals
        );
        const balanceNum = parseFloat(balance);
        const price = prices[token.coingeckoId] || (token.coingeckoId === 'usd-coin' || token.coingeckoId === 'tether' ? 1 : 0);
        
        return {
          symbol: token.symbol,
          name: token.name,
          balance: balanceNum.toFixed(token.decimals === 6 ? 2 : 6),
          balanceUsd: balanceNum * price,
          logoURI: token.logoURI,
          price,
        };
      });

      const erc20Balances = await Promise.all(erc20Promises);
      
      // Add all tokens (even zero balance)
      for (const balance of erc20Balances) {
        tokenBalances.push(balance);
      }

      setBalances(tokenBalances);
      setTotalValue(tokenBalances.reduce((sum, t) => sum + t.balanceUsd, 0));
    } catch (error) {
      console.error('Error fetching balances:', error);
      setPriceError(true);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [isConnected, address, nativeBalance]);

  // Refetch function that also refreshes the balance from chain
  const refetch = useCallback(async () => {
    // Clear cache to force fresh prices
    cachedPrices = {};
    cacheTimestamp = 0;
    await refetchBalance();
    await fetchBalances();
  }, [fetchBalances, refetchBalance]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { 
    balances, 
    totalValue, 
    loading, 
    isConnected, 
    address, 
    refetch,
    priceError 
  };
};
