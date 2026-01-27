import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TreeStats {
  totalTrees: number;
  totalDonationsUsd: number;
  totalSwaps: number;
}

export const useTreeCounter = () => {
  const [stats, setStats] = useState<TreeStats>({
    totalTrees: 0,
    totalDonationsUsd: 0,
    totalSwaps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('tree_counter')
          .select('total_trees, total_donations_usd, total_swaps')
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setStats({
            totalTrees: parseFloat(String(data.total_trees)) || 0,
            totalDonationsUsd: parseFloat(String(data.total_donations_usd)) || 0,
            totalSwaps: data.total_swaps || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching tree stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('tree_counter_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tree_counter' },
        (payload) => {
          const newData = payload.new as any;
          setStats({
            totalTrees: parseFloat(newData.total_trees) || 0,
            totalDonationsUsd: parseFloat(newData.total_donations_usd) || 0,
            totalSwaps: newData.total_swaps || 0,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { stats, loading };
};
