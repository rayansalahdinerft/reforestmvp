import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/hooks/useWallet';

export const useWatchlist = () => {
  const { address, isConnected } = useWallet();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizedAddress = address?.toLowerCase() ?? '';

  useEffect(() => {
    if (!isConnected || !normalizedAddress) {
      setWatchlist([]);
      return;
    }

    setLoading(true);
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('watchlist')
          .select('token_id')
          .eq('wallet_address', normalizedAddress);

        if (error) throw error;
        setWatchlist((data ?? []).map((d: any) => d.token_id));
      } catch (err) {
        console.error('Error fetching watchlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [normalizedAddress, isConnected]);

  const toggle = useCallback(async (tokenId: string) => {
    if (!normalizedAddress) return;

    const isInList = watchlist.includes(tokenId);

    // Optimistic update
    setWatchlist(prev =>
      isInList ? prev.filter(id => id !== tokenId) : [...prev, tokenId]
    );

    try {
      if (isInList) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('wallet_address', normalizedAddress)
          .eq('token_id', tokenId);
      } else {
        await supabase
          .from('watchlist')
          .insert({ wallet_address: normalizedAddress, token_id: tokenId });
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      // Revert optimistic update
      setWatchlist(prev =>
        isInList ? [...prev, tokenId] : prev.filter(id => id !== tokenId)
      );
    }
  }, [normalizedAddress, watchlist]);

  const isWatched = useCallback((tokenId: string) => watchlist.includes(tokenId), [watchlist]);

  return { watchlist, loading, toggle, isWatched, isConnected };
};
