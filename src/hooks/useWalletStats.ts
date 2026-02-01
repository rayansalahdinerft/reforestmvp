import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppKitAccount } from '@reown/appkit/react';

interface WalletStats {
  totalTrees: number;
  totalDonationsUsd: number;
  totalSwaps: number;
}

export const useWalletStats = () => {
  const { address, isConnected } = useAppKitAccount();
  const [stats, setStats] = useState<WalletStats>({
    totalTrees: 0,
    totalDonationsUsd: 0,
    totalSwaps: 0,
  });
  // Important UX: we keep showing 0s when disconnected/loading, then update when data arrives.
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setStats({ totalTrees: 0, totalDonationsUsd: 0, totalSwaps: 0 });
      setLoading(false);
      return;
    }

    // Reset to 0 while fetching to avoid showing someone else's previous values.
    setStats({ totalTrees: 0, totalDonationsUsd: 0, totalSwaps: 0 });
    setLoading(true);

    const fetchStats = async () => {
      try {
        const normalizedAddress = address.toLowerCase();
        
        const { data, error } = await supabase
          .from('wallet_stats')
          .select('total_trees, total_donations_usd, total_swaps')
          .eq('wallet_address', normalizedAddress)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setStats({
            totalTrees: parseFloat(String(data.total_trees)) || 0,
            totalDonationsUsd: parseFloat(String(data.total_donations_usd)) || 0,
            totalSwaps: data.total_swaps || 0,
          });
        } else {
          // No stats yet for this wallet
          setStats({ totalTrees: 0, totalDonationsUsd: 0, totalSwaps: 0 });
        }
      } catch (err) {
        console.error('Error fetching wallet stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to realtime updates for this wallet
    const normalizedAddress = address.toLowerCase();
    const channel = supabase
      .channel(`wallet_stats_${normalizedAddress}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'wallet_stats',
          filter: `wallet_address=eq.${normalizedAddress}`
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData) {
            // Extra safety: never apply an update for another wallet.
            if (
              typeof newData.wallet_address === 'string' &&
              newData.wallet_address.toLowerCase() !== normalizedAddress
            ) {
              return;
            }
            setStats({
              totalTrees: parseFloat(newData.total_trees) || 0,
              totalDonationsUsd: parseFloat(newData.total_donations_usd) || 0,
              totalSwaps: newData.total_swaps || 0,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [address, isConnected]);

  return { stats, loading, isConnected };
};
