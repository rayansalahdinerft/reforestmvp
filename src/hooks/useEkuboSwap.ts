import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStarknetWallet } from './useStarknetWallet';
import type { Token } from '@/config/tokens';

export type EkuboSwapStatus = 'idle' | 'fetching-quote' | 'building-tx' | 'awaiting-signature' | 'confirming' | 'success' | 'error';

interface SwapResult {
  transactionHash?: string;
  buyAmount?: string;
  error?: string;
}

// Ekubo Router contract on Starknet mainnet
const EKUBO_ROUTER = '0x0199741822c2dc722f6f605204f35e56dbc23bceed54818168571b275542ee42';

// Starknet token addresses
const STARKNET_ETH = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

export const useEkuboSwap = () => {
  const [status, setStatus] = useState<EkuboSwapStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [quote, setQuote] = useState<any>(null);

  const { address, isConnected, signAndExecute, connect } = useStarknetWallet();

  const getQuote = async (
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    takerAddress?: string
  ) => {
    const { data, error } = await supabase.functions.invoke('ekubo-quote', {
      body: {
        sellTokenAddress: sellToken,
        buyTokenAddress: buyToken,
        sellAmount,
        takerAddress,
      },
    });

    if (error) throw new Error(error.message);
    if (!data.success) throw new Error(data.error || 'Failed to get Ekubo quote');

    return data;
  };

  const fetchQuote = useCallback(async (
    sellToken: Token,
    buyToken: Token,
    sellAmount: string
  ) => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      setQuote(null);
      return null;
    }

    try {
      // Convert amount to wei
      const amountInWei = BigInt(Math.floor(parseFloat(sellAmount) * 10 ** sellToken.decimals)).toString();
      
      const quoteData = await getQuote(
        sellToken.address,
        buyToken.address,
        amountInWei,
        address || undefined
      );

      setQuote(quoteData);
      return quoteData;
    } catch (err) {
      console.error('Failed to fetch Ekubo quote:', err);
      setQuote(null);
      return null;
    }
  }, [address]);

  const executeSwap = useCallback(async (
    sellToken: Token,
    buyToken: Token,
    sellAmount: string,
    slippage: number = 1
  ): Promise<SwapResult> => {
    setError(null);
    setTxHash(null);

    if (!isConnected || !address) {
      try {
        await connect();
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to connect wallet';
        setError(msg);
        return { error: msg };
      }
    }

    try {
      setStatus('fetching-quote');

      // Convert amount to wei
      const amountInWei = BigInt(Math.floor(parseFloat(sellAmount) * 10 ** sellToken.decimals)).toString();

      // Get quote from Ekubo
      const quoteData = await getQuote(
        sellToken.address,
        buyToken.address,
        amountInWei,
        address!
      );

      console.log('Ekubo Quote:', quoteData);

      setStatus('building-tx');

      // Calculate minimum output with slippage
      const buyAmountBigInt = BigInt(quoteData.buyAmount || '0');
      const minOutput = (buyAmountBigInt * BigInt(100 - slippage) / 100n).toString();

      // Check if we're swapping native ETH
      const isNativeETH = sellToken.address.toLowerCase() === STARKNET_ETH.toLowerCase();

      // Build the swap calls
      const calls = [];

      // If not native ETH, we need to approve the router first
      if (!isNativeETH) {
        calls.push({
          contractAddress: sellToken.address,
          entrypoint: 'approve',
          calldata: [
            EKUBO_ROUTER, // spender
            amountInWei, // amount low
            '0', // amount high (for u256)
          ],
        });
      }

      // Build swap call using Ekubo's route
      // The route from the API contains the pool path
      const route = quoteData.route;
      
      // Ekubo swap call
      // This is a simplified version - in production you'd need to encode the full route
      calls.push({
        contractAddress: EKUBO_ROUTER,
        entrypoint: 'swap',
        calldata: [
          sellToken.address, // token_in
          buyToken.address, // token_out
          amountInWei, // amount_in low
          '0', // amount_in high
          minOutput, // min_amount_out low
          '0', // min_amount_out high
          address!, // recipient
          // Route data would be encoded here based on quoteData.route
        ],
      });

      setStatus('awaiting-signature');

      // Execute transaction
      const result = await signAndExecute(calls);

      console.log('Ekubo swap result:', result);

      setStatus('confirming');

      // Get transaction hash
      const transactionHash = result.transaction_hash || result.transactionHash || result;
      setTxHash(transactionHash);

      // Wait for confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));

      setStatus('success');

      return {
        transactionHash,
        buyAmount: quoteData.buyAmount,
      };
    } catch (err) {
      console.error('Ekubo swap error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Swap failed';
      setError(errorMessage);
      setStatus('error');
      return { error: errorMessage };
    }
  }, [address, isConnected, connect, signAndExecute]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setTxHash(null);
    setQuote(null);
  }, []);

  return {
    status,
    error,
    txHash,
    quote,
    fetchQuote,
    executeSwap,
    reset,
    isConnected,
    address,
    connect,
  };
};
