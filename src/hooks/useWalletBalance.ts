import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useBalance } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: number;
  logoURI?: string;
  price: number;
}

// Cache for ETH price to avoid repeated API calls
let cachedEthPrice: number | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const useWalletBalance = () => {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const fetchingRef = useRef(false);

  // Get native balance
  const { data: nativeBalance, refetch: refetchBalance } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  const fetchEthPrice = async (): Promise<number> => {
    // Check cache first
    const now = Date.now();
    if (cachedEthPrice !== null && now - cacheTimestamp < CACHE_DURATION) {
      return cachedEthPrice;
    }

    // Try CoinGecko API directly first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const priceRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        const price = priceData.ethereum?.usd;
        if (price && price > 0) {
          cachedEthPrice = price;
          cacheTimestamp = now;
          return price;
        }
      }
    } catch (e) {
      console.log('CoinGecko direct API failed, trying edge function...');
    }

    // Fallback to edge function
    try {
      const { data, error } = await supabase.functions.invoke('coingecko-markets', {
        body: { ids: ['ethereum'] }
      });

      if (!error && data?.data?.[0]?.current_price) {
        const price = data.data[0].current_price;
        cachedEthPrice = price;
        cacheTimestamp = now;
        return price;
      }
    } catch (e) {
      console.error('Edge function fallback failed:', e);
    }

    // Return cached price even if expired, or 0 if no cache
    return cachedEthPrice || 0;
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
      // Fetch ETH price with fallback
      const ethPrice = await fetchEthPrice();
      
      if (ethPrice === 0) {
        setPriceError(true);
      }

      // Format balance from bigint
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

      setBalances(tokenBalances);
      setTotalValue(ethBalanceUsd);
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
    // Clear cache to force fresh price
    cachedEthPrice = null;
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
