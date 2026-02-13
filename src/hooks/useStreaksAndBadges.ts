import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAppKitAccount } from '@reown/appkit/react';

interface Badge {
  badge_type: string;
  badge_name: string;
  badge_description: string | null;
  earned_at: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastSwapDate: string | null;
  badges: Badge[];
  loading: boolean;
}

export const useStreaksAndBadges = () => {
  const { address, isConnected } = useAppKitAccount();
  const [data, setData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastSwapDate: null,
    badges: [],
    loading: false,
  });

  useEffect(() => {
    if (!isConnected || !address) {
      setData({ currentStreak: 0, longestStreak: 0, lastSwapDate: null, badges: [], loading: false });
      return;
    }

    const normalizedAddress = address.toLowerCase();
    setData(prev => ({ ...prev, loading: true }));

    const fetchAll = async () => {
      try {
        // Fetch streak data from wallet_stats
        const { data: walletData } = await supabase
          .from('wallet_stats')
          .select('current_streak, longest_streak, last_swap_date')
          .eq('wallet_address', normalizedAddress)
          .maybeSingle();

        // Fetch badges
        const { data: badgeData } = await supabase
          .from('badges')
          .select('badge_type, badge_name, badge_description, earned_at')
          .eq('wallet_address', normalizedAddress)
          .order('earned_at', { ascending: true });

        setData({
          currentStreak: (walletData as any)?.current_streak ?? 0,
          longestStreak: (walletData as any)?.longest_streak ?? 0,
          lastSwapDate: (walletData as any)?.last_swap_date ?? null,
          badges: (badgeData as any[]) ?? [],
          loading: false,
        });
      } catch (err) {
        console.error('Error fetching streaks/badges:', err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchAll();
  }, [address, isConnected]);

  return data;
};
