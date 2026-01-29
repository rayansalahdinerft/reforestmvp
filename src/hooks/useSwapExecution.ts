import { useState, useCallback } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { parseUnits, formatUnits, createPublicClient, http } from 'viem';
import { mainnet, polygon, arbitrum, optimism, base, avalanche, bsc } from 'viem/chains';
import { supabase } from '@/integrations/supabase/client';
import { 
  REFOREST_FEE_SPLITTER_ABI, 
  ERC20_ABI,
  NATIVE_TOKEN_ADDRESS,
  getContractAddress 
} from '@/config/contracts';
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

  const { address: userAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

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

    console.log('Approving token...');
    setStatus('approving');

    const hash = await writeContractAsync({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress, amount]
    } as any);

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
      // Check if contract is deployed
      const contractAddress = getContractAddress(chainId);
      if (!contractAddress) {
        setError('Smart contract not yet deployed on this chain. Contact team for deployment.');
        setStatus('error');
        return { error: 'Contract not deployed on this chain' };
      }

      setStatus('fetching-quote');

      // Convert amount to wei
      const amountInWei = parseUnits(sellAmount, sellToken.decimals);
      const isNativeToken = sellToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

      // Get swap data from 0x API via edge function
      const { data: swapData, error: swapError } = await supabase.functions.invoke('zerox-swap', {
        body: {
          chainId,
          fromToken: sellToken.address,
          toToken: buyToken.address,
          amount: amountInWei.toString(),
          userAddress,
          slippagePercentage: slippage,
        },
      });

      if (swapError || !swapData?.success) {
        throw new Error(swapData?.error || swapError?.message || 'Failed to get swap data');
      }

      console.log('Swap data from 0x:', swapData);

      // For ERC20 tokens, approve the contract first
      if (!isNativeToken) {
        await checkAndApproveToken(
          sellToken.address as `0x${string}`,
          contractAddress,
          amountInWei,
          chainId
        );
      }

      setStatus('swapping');

      // Execute swap through ReforestFeeSplitter contract
      // The contract takes 1% fee and forwards 99% to 0x router with swapData
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: REFOREST_FEE_SPLITTER_ABI,
        functionName: 'swap',
        args: [
          sellToken.address as `0x${string}`, // srcToken
          buyToken.address as `0x${string}`,  // dstToken
          amountInWei,                         // srcAmount (full 100%)
          BigInt(swapData.minBuyAmount || '0'), // minDstAmount
          swapData.swapData as `0x${string}`   // 0x swap calldata
        ],
        value: isNativeToken ? amountInWei : 0n
      } as any);

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
  }, [writeContractAsync, userAddress]);

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
