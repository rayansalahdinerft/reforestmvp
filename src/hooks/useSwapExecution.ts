import { useState, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { parseUnits, formatUnits, createPublicClient, createWalletClient, custom, http } from 'viem';
import { mainnet, polygon, arbitrum, optimism, base, avalanche, bsc } from 'viem/chains';
import { supabase } from '@/integrations/supabase/client';
import { ERC20_ABI, NATIVE_TOKEN_ADDRESS } from '@/config/contracts';
import type { Token } from '@/config/tokens';

export type SwapStatus = 'idle' | 'fetching-quote' | 'approving' | 'swapping' | 'success' | 'error';

interface SwapResult {
  hash?: `0x${string}`;
  dstAmount?: string;
  error?: string;
}

const CHAIN_CONFIG: Record<number, any> = {
  1: mainnet,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  8453: base,
  43114: avalanche,
  56: bsc,
};

export const useSwapExecution = () => {
  const [status, setStatus] = useState<SwapStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { address: userAddress, getProvider } = useWallet();

  const sendTransaction = async (params: { to: `0x${string}`; data?: `0x${string}`; value?: bigint; chainId?: number }) => {
    const web3Provider = await getProvider();
    if (!web3Provider) throw new Error('No provider');
    const chain = params.chainId ? CHAIN_CONFIG[params.chainId] ?? mainnet : mainnet;
    const walletClient = createWalletClient({
      chain,
      transport: custom(web3Provider),
      account: userAddress as `0x${string}`,
    });
    return await walletClient.sendTransaction({
      to: params.to,
      data: params.data,
      value: params.value,
      account: userAddress as `0x${string}`,
      chain,
    });
  };

  const checkAndApproveToken = async (
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    amount: bigint,
    chainId: number
  ) => {
    if (!userAddress) throw new Error('Wallet not connected');
    
    if (tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      return; // No approval needed for native token
    }

    const chain = CHAIN_CONFIG[chainId];
    if (!chain) throw new Error('Unsupported chain');

    const publicClient = createPublicClient({
      chain,
      transport: http()
    });

    // Check current allowance
    let allowance: bigint = 0n;
    try {
      const result = await publicClient.call({
        to: tokenAddress,
        data: `0xdd62ed3e${userAddress.slice(2).padStart(64, '0')}${spenderAddress.slice(2).padStart(64, '0')}` as `0x${string}`
      });
      if (result.data) {
        allowance = BigInt(result.data);
      }
    } catch (e) {
      console.log('Error checking allowance:', e);
    }

    if (allowance >= amount) {
      console.log('Token already approved');
      return;
    }

    console.log('Approving token to spender:', spenderAddress);
    setStatus('approving');

    // Use sendTransactionAsync for approval
    const approvalData = `0x095ea7b3${spenderAddress.slice(2).padStart(64, '0')}${'ff'.repeat(32)}` as `0x${string}`;
    
    const hash = await sendTransactionAsync({
      to: tokenAddress,
      data: approvalData,
    });

    // Wait for approval confirmation
    await publicClient.waitForTransactionReceipt({ hash });
    console.log('Token approved:', hash);
  };

  const executeSwap = useCallback(async (
    chainId: number,
    sellToken: Token,
    buyToken: Token,
    sellAmount: string,
    slippage: number = 1
  ): Promise<SwapResult> => {
    setError(null);
    setTxHash(null);

    if (!userAddress) {
      setError('Wallet not connected');
      return { error: 'Wallet not connected' };
    }

    try {
      setStatus('fetching-quote');

      // Convert amount to wei
      const amountInWei = parseUnits(sellAmount, sellToken.decimals);
      const isNativeToken = sellToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

      // Get swap data from 0x API v2 via edge function
      const { data: swapData, error: swapError } = await supabase.functions.invoke('zerox-swap', {
        body: {
          chainId,
          fromToken: sellToken.address,
          toToken: buyToken.address,
          amount: amountInWei.toString(),
          userAddress,
          slippageBps: slippage * 100, // Convert percentage to bps
        },
      });

      if (swapError || !swapData?.success) {
        throw new Error(swapData?.error || swapError?.message || 'Failed to get swap data');
      }

      console.log('Swap data from 0x v2:', swapData);

      // For ERC20 tokens, approve the 0x allowance target
      if (!isNativeToken && swapData.allowanceTarget) {
        await checkAndApproveToken(
          sellToken.address as `0x${string}`,
          swapData.allowanceTarget as `0x${string}`,
          amountInWei,
          chainId
        );
      }

      setStatus('swapping');

      // Execute the swap using the transaction data from 0x v2
      // The 1% fee is automatically collected by 0x and sent to the fee recipient
      const hash = await sendTransactionAsync({
        to: swapData.transaction.to as `0x${string}`,
        data: swapData.transaction.data as `0x${string}`,
        value: isNativeToken ? amountInWei : BigInt(swapData.transaction.value || '0'),
        gas: swapData.transaction.gas ? BigInt(swapData.transaction.gas) : undefined,
      });

      setTxHash(hash);
      console.log('Swap transaction submitted:', hash);

      // Wait for confirmation
      const chain = CHAIN_CONFIG[chainId];
      const publicClient = createPublicClient({
        chain,
        transport: http()
      });
      
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      
      if (receipt?.status === 'success') {
        setStatus('success');
        // Use the estimated output from 0x
        const receivedAmount = formatUnits(BigInt(swapData.toAmount), buyToken.decimals);
        return { hash, dstAmount: receivedAmount };
      } else {
        throw new Error('Transaction failed');
      }

    } catch (err) {
      console.error('Swap execution error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Swap failed';
      setError(errorMessage);
      setStatus('error');
      return { error: errorMessage };
    }
  }, [sendTransactionAsync, userAddress]);

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
    reset
  };
};
