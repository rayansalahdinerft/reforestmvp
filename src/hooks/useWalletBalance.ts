import { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { useBalance } from 'wagmi';

interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: number;
  logoURI?: string;
  price: number;
}

export const useWalletBalance = () => {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get native balance
  const { data: nativeBalance } = useBalance({
    address: address as `0x${string}` | undefined,
  });

  const fetchBalances = useCallback(async () => {
    if (!isConnected || !address) {
      setBalances([]);
      setTotalValue(0);
      return;
    }

    setLoading(true);

    try {
      // Fetch ETH price
      const priceRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const priceData = await priceRes.json();
      const ethPrice = priceData.ethereum?.usd || 0;

      // Format balance from bigint
      const ethBalance = nativeBalance 
        ? Number(nativeBalance.value) / Math.pow(10, nativeBalance.decimals) 
        : 0;
      const ethBalanceUsd = ethBalance * ethPrice;

      const tokenBalances: TokenBalance[] = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance.toFixed(4),
          balanceUsd: ethBalanceUsd,
          logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
          price: ethPrice,
        },
      ];

      setBalances(tokenBalances);
      setTotalValue(ethBalanceUsd);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, nativeBalance]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { balances, totalValue, loading, isConnected, address, refetch: fetchBalances };
};
