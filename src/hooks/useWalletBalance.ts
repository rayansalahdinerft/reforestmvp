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

// Top 30 cryptos by market cap — real names, proper ranking
const ERC20_TOKENS = [
  // #2 Bitcoin (ERC-20 wrapped)
  { symbol: 'BTC', name: 'Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' as `0x${string}`, decimals: 8, logoURI: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', coingeckoId: 'bitcoin' },
  // #3 Tether
  { symbol: 'USDT', name: 'Tether', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`, decimals: 6, logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png', coingeckoId: 'tether' },
  // #4 BNB (ERC-20)
  { symbol: 'BNB', name: 'BNB', address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', coingeckoId: 'binancecoin' },
  // #5 Solana (ERC-20 wrapped)
  { symbol: 'SOL', name: 'Solana', address: '0xD31a59c85aE9D8edEFec411186ADc5Ddf0d5a513' as `0x${string}`, decimals: 9, logoURI: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', coingeckoId: 'solana' },
  // #6 USDC
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as `0x${string}`, decimals: 6, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png', coingeckoId: 'usd-coin' },
  // #7 XRP (ERC-20 wrapped)
  { symbol: 'XRP', name: 'XRP', address: '0x628F76eAB0C1298F7a24d337bBbF749Bd6b37F07' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', coingeckoId: 'ripple' },
  // #8 Cardano (ERC-20)
  { symbol: 'ADA', name: 'Cardano', address: '0x0000000000000000000000000000000000000000' as `0x${string}`, decimals: 6, logoURI: 'https://assets.coingecko.com/coins/images/975/small/cardano.png', coingeckoId: 'cardano' },
  // #9 Dogecoin (ERC-20)
  { symbol: 'DOGE', name: 'Dogecoin', address: '0x0000000000000000000000000000000000000001' as `0x${string}`, decimals: 8, logoURI: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png', coingeckoId: 'dogecoin' },
  // #10 Avalanche (ERC-20)
  { symbol: 'AVAX', name: 'Avalanche', address: '0x0000000000000000000000000000000000000002' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png', coingeckoId: 'avalanche-2' },
  // #11 TRON (ERC-20)
  { symbol: 'TRX', name: 'TRON', address: '0x0000000000000000000000000000000000000003' as `0x${string}`, decimals: 6, logoURI: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png', coingeckoId: 'tron' },
  // #12 Chainlink
  { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', coingeckoId: 'chainlink' },
  // #13 Polkadot (ERC-20)
  { symbol: 'DOT', name: 'Polkadot', address: '0x0000000000000000000000000000000000000004' as `0x${string}`, decimals: 10, logoURI: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png', coingeckoId: 'polkadot' },
  // #14 Polygon/MATIC
  { symbol: 'POL', name: 'Polygon', address: '0x455e53CBB86018Ac2B8092FdCd39d8444aFFC3F6' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png', coingeckoId: 'matic-network' },
  // #15 Shiba Inu
  { symbol: 'SHIB', name: 'Shiba Inu', address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png', coingeckoId: 'shiba-inu' },
  // #16 DAI
  { symbol: 'DAI', name: 'Dai', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png', coingeckoId: 'dai' },
  // #17 Uniswap
  { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg', coingeckoId: 'uniswap' },
  // #18 Litecoin (ERC-20)
  { symbol: 'LTC', name: 'Litecoin', address: '0x0000000000000000000000000000000000000005' as `0x${string}`, decimals: 8, logoURI: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png', coingeckoId: 'litecoin' },
  // #19 PEPE
  { symbol: 'PEPE', name: 'Pepe', address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg', coingeckoId: 'pepe' },
  // #20 Aave
  { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png', coingeckoId: 'aave' },
  // #21 Render
  { symbol: 'RNDR', name: 'Render', address: '0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png', coingeckoId: 'render-token' },
  // #22 Arbitrum
  { symbol: 'ARB', name: 'Arbitrum', address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg', coingeckoId: 'arbitrum' },
  // #23 Fetch.ai
  { symbol: 'FET', name: 'Fetch.ai', address: '0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg', coingeckoId: 'fetch-ai' },
  // #24 Maker
  { symbol: 'MKR', name: 'Maker', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png', coingeckoId: 'maker' },
  // #25 Optimism
  { symbol: 'OP', name: 'Optimism', address: '0x4200000000000000000000000000000000000042' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png', coingeckoId: 'optimism' },
  // #26 The Graph
  { symbol: 'GRT', name: 'The Graph', address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png', coingeckoId: 'the-graph' },
  // #27 Starknet
  { symbol: 'STRK', name: 'Starknet', address: '0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/26433/small/starknet.png', coingeckoId: 'starknet' },
  // #28 Lido DAO
  { symbol: 'LDO', name: 'Lido DAO', address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png', coingeckoId: 'lido-dao' },
  // #29 Worldcoin
  { symbol: 'WLD', name: 'Worldcoin', address: '0x163f8C2467924be0ae7B5347228CABF260318753' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/31069/small/worldcoin.jpeg', coingeckoId: 'worldcoin-wld' },
  // #30 Pendle
  { symbol: 'PENDLE', name: 'Pendle', address: '0x808507121B80c02388fAd14726482e061B8da827' as `0x${string}`, decimals: 18, logoURI: 'https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png', coingeckoId: 'pendle' },
];

// Addresses that are placeholders (non-ERC20 on Ethereum)
const PLACEHOLDER_ADDRESSES = [
  '0x0000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000001',
  '0x0000000000000000000000000000000000000002',
  '0x0000000000000000000000000000000000000003',
  '0x0000000000000000000000000000000000000004',
  '0x0000000000000000000000000000000000000005',
];

// Cache for prices
let cachedPrices: Record<string, number> = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000;

const BALANCE_OF_SELECTOR = '0x70a08231';

export const useWalletBalance = (overrideAddress?: string | null) => {
  const { address: connectedAddress, isConnected, chainId } = useWallet();
  const address = overrideAddress ?? connectedAddress;
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const fetchingRef = useRef(false);
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
    const now = Date.now();
    if (Object.keys(cachedPrices).length > 0 && now - cacheTimestamp < CACHE_DURATION) {
      return cachedPrices;
    }

    const ids = [...new Set(ERC20_TOKENS.map(t => t.coingeckoId).concat('ethereum'))];
    
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

    return cachedPrices.ethereum ? cachedPrices : { ethereum: 0, 'usd-coin': 1, tether: 1 };
  };

  const fetchERC20Balance = async (
    tokenAddress: `0x${string}`,
    userAddress: `0x${string}`,
    decimals: number
  ): Promise<string> => {
    // Skip placeholder addresses
    if (PLACEHOLDER_ADDRESSES.includes(tokenAddress)) return '0';
    try {
      const publicClient = createPublicClient({ chain: mainnet, transport: http() });
      const paddedAddress = userAddress.slice(2).toLowerCase().padStart(64, '0');
      const data = `${BALANCE_OF_SELECTOR}${paddedAddress}` as `0x${string}`;
      const result = await publicClient.call({ to: tokenAddress, data });
      if (result.data) {
        const balance = BigInt(result.data);
        return formatUnits(balance, decimals);
      }
      return '0';
    } catch (e) {
      return '0';
    }
  };

  const fetchBalances = useCallback(async () => {
    if (!isConnected || !address) {
      setBalances([]);
      setTotalValue(0);
      return;
    }

    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setPriceError(false);

    try {
      const prices = await fetchPrices();
      const ethPrice = prices.ethereum || 0;
      if (ethPrice === 0) setPriceError(true);

      const ethBalance = Number(formatEther(nativeBalanceWei));
      const ethBalanceUsd = ethBalance * ethPrice;

      const tokenBalances: TokenBalance[] = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance.toFixed(6),
          balanceUsd: ethBalanceUsd,
          logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
          price: ethPrice,
        },
      ];

      const erc20Promises = ERC20_TOKENS.map(async (token) => {
        const balance = await fetchERC20Balance(token.address, address as `0x${string}`, token.decimals);
        const balanceNum = parseFloat(balance);
        const price = prices[token.coingeckoId] || (token.coingeckoId === 'usd-coin' || token.coingeckoId === 'tether' ? 1 : 0);
        return {
          symbol: token.symbol,
          name: token.name,
          balance: balanceNum.toFixed(token.decimals <= 6 ? 2 : 6),
          balanceUsd: balanceNum * price,
          logoURI: token.logoURI,
          price,
        };
      });

      const erc20Balances = await Promise.all(erc20Promises);
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
  }, [isConnected, address, nativeBalanceWei]);

  const refetch = useCallback(async () => {
    cachedPrices = {};
    cacheTimestamp = 0;
    await fetchNativeBalance();
    await fetchBalances();
  }, [fetchBalances, fetchNativeBalance]);

  useEffect(() => { fetchNativeBalance(); }, [fetchNativeBalance]);
  useEffect(() => { fetchBalances(); }, [fetchBalances]);

  return { balances, totalValue, loading, isConnected, address, refetch, priceError };
};
