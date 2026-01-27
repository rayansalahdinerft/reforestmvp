import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Token } from '@/config/tokens';

export interface SwapQuote {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  protocols: string[];
  priceImpact: string;
}

export const useSwapQuote = (
  fromToken: Token | null,
  toToken: Token | null,
  amount: string,
  chainId: number
) => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
        setQuote(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('oneinch-quote', {
          body: {
            chainId,
            fromToken: fromToken.address,
            toToken: toToken.address,
            amount: (parseFloat(amount) * Math.pow(10, fromToken.decimals)).toString(),
          },
        });

        if (fnError) throw fnError;

        if (data?.toAmount) {
          const toAmountFormatted = (
            parseFloat(data.toAmount) / Math.pow(10, toToken.decimals)
          ).toFixed(6);

          setQuote({
            fromToken,
            toToken,
            fromAmount: amount,
            toAmount: toAmountFormatted,
            estimatedGas: data.estimatedGas || '0',
            protocols: data.protocols || [],
            priceImpact: data.priceImpact || '0',
          });
        }
      } catch (err) {
        console.error('Quote error:', err);
        setError('Failed to fetch quote');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [fromToken, toToken, amount, chainId]);

  return { quote, loading, error };
};
