import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppKitAccount } from '@reown/appkit/react';

export interface SwapHistoryRow {
  id: string;
  wallet_address: string;
  sell_token: string;
  buy_token: string;
  sell_amount: string;
  buy_amount: string;
  tx_hash: string;
  chain_id: number;
  status: string;
  donation_usd: number;
  trees_planted: number;
  created_at: string;
}

export const useSwapHistory = () => {
  const [history, setHistory] = useState<SwapHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAppKitAccount();

  useEffect(() => {
    if (!address) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('swap_history')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching swap history:', error);
      } else {
        setHistory((data as SwapHistoryRow[]) || []);
      }
      setLoading(false);
    };

    fetchHistory();

    // Realtime subscription
    const channel = supabase
      .channel('swap_history_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'swap_history',
          filter: `wallet_address=eq.${address.toLowerCase()}`,
        },
        (payload) => {
          setHistory((prev) => [payload.new as SwapHistoryRow, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address]);

  const totalStats = {
    totalSwaps: history.length,
    totalDonated: history.reduce((sum, h) => sum + Number(h.donation_usd), 0),
    totalTrees: history.reduce((sum, h) => sum + Number(h.trees_planted), 0),
  };

  return { history, loading, totalStats };
};
