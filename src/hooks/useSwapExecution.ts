import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
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

  const { address: userAddress, chainId: walletChainId } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
  });

  const getSwapData = async (
    chainId: number,
    fromToken: string,
    toToken: string,
    amount: string,
    fromAddress: string,
    slippage: number = 1
  ) => {
    const { data, error } = await supabase.functions.invoke('oneinch-swap', {
      body: { chainId, fromToken, toToken, amount, fromAddress, slippage }
    });

    if (error) throw new Error(error.message);
    if (!data.success) {
      if (data.demo) {
        throw new Error('DEMO_MODE: 1inch API key not configured. Add ONEINCH_API_KEY secret.');
      }
      throw new Error(data.error || 'Failed to get swap data');
    }

    return data;
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

    // Check current allowance using call
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

      // Get swap data from 1inch
      const swapData = await getSwapData(
        chainId,
        sellToken.address,
        buyToken.address,
        amountInWei.toString(),
        contractAddress,
        slippage
      );

      const isNativeToken = sellToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

      // Approve token if ERC20
      if (!isNativeToken) {
        await checkAndApproveToken(
          sellToken.address as `0x${string}`,
          contractAddress,
          amountInWei,
          chainId
        );
      }

      setStatus('swapping');

      // Calculate minimum output with slippage
      const minDstAmount = BigInt(swapData.toAmount) * BigInt(100 - slippage) / 100n;

      // Execute swap through our contract
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: REFOREST_FEE_SPLITTER_ABI,
        functionName: 'swap',
        args: [
          sellToken.address as `0x${string}`,
          buyToken.address as `0x${string}`,
          amountInWei,
          minDstAmount,
          swapData.tx.data as `0x${string}`
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
        return { hash, dstAmount: formatUnits(BigInt(swapData.toAmount), buyToken.decimals) };
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
    isConfirming,
    isConfirmed,
    executeSwap,
    reset
  };
};
