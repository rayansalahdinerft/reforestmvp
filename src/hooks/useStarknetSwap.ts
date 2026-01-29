import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStarknetWallet } from './useStarknetWallet';
import type { Token } from '@/config/tokens';

export type StarknetSwapStatus = 'idle' | 'fetching-quote' | 'building-tx' | 'awaiting-signature' | 'confirming' | 'success' | 'error';

interface SwapResult {
  transactionHash?: string;
  buyAmount?: string;
  error?: string;
}

// Starknet token addresses
const STARKNET_ETH = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
const STARKNET_USDC = '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8';
const STARKNET_USDT = '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8';
const STARKNET_DAI = '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3';
const STARKNET_STRK = '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d';

// Fee recipient for reforestation
const REFOREST_FEE_RECIPIENT = '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669';
const FEE_BPS = 100; // 1% = 100 basis points

export const useStarknetSwap = () => {
  const [status, setStatus] = useState<StarknetSwapStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address, isConnected, signAndExecute, connect } = useStarknetWallet();

  const getQuote = async (
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    takerAddress?: string
  ) => {
    const { data, error } = await supabase.functions.invoke('avnu-quote', {
      body: {
        sellTokenAddress: sellToken,
        buyTokenAddress: buyToken,
        sellAmount,
        takerAddress,
      },
    });

    if (error) throw new Error(error.message);
    if (!data.success) throw new Error(data.error || 'Failed to get quote');

    return data;
  };

  const buildSwapTransaction = async (
    quoteId: string,
    slippage: number = 1,
    takerAddress: string
  ) => {
    const { data, error } = await supabase.functions.invoke('avnu-build-swap', {
      body: {
        quoteId,
        slippage,
        takerAddress,
        includeApprove: true,
      },
    });

    if (error) throw new Error(error.message);
    if (!data.success) throw new Error(data.error || 'Failed to build swap transaction');

    return data;
  };

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

      // Convert amount to wei (considering decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(sellAmount) * 10 ** sellToken.decimals)).toString();

      // Get quote from AVNU
      const quote = await getQuote(
        sellToken.address,
        buyToken.address,
        amountInWei,
        address!
      );

      console.log('AVNU Quote:', quote);

      setStatus('building-tx');

      // Build the swap calldata
      const swapData = await buildSwapTransaction(
        quote.quoteId,
        slippage,
        address!
      );

      console.log('Swap calldata:', swapData);

      setStatus('awaiting-signature');

      // Prepare calls array
      const calls = [];

      // Add approve call if needed (for ERC20 tokens, not ETH)
      if (swapData.approveCall) {
        calls.push({
          contractAddress: sellToken.address,
          entrypoint: 'approve',
          calldata: swapData.approveCall.calldata,
        });
      }

      // Add swap call
      calls.push({
        contractAddress: swapData.contractAddress,
        entrypoint: swapData.entrypoint,
        calldata: swapData.calldata,
      });

      // Execute transaction
      const result = await signAndExecute(calls);

      console.log('Transaction result:', result);

      setStatus('confirming');

      // Get transaction hash
      const transactionHash = result.transaction_hash || result.transactionHash || result;
      setTxHash(transactionHash);

      // Wait for confirmation (simplified - in production use a proper polling mechanism)
      await new Promise(resolve => setTimeout(resolve, 3000));

      setStatus('success');

      return {
        transactionHash,
        buyAmount: quote.buyAmount,
      };
    } catch (err) {
      console.error('Starknet swap error:', err);
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
  }, []);

  return {
    status,
    error,
    txHash,
    executeSwap,
    reset,
    isConnected,
    address,
    connect,
  };
};
