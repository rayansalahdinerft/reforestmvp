import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin breaks $100K milestone as institutional adoption accelerates',
    url: '#',
    source: 'CoinDesk',
    publishedAt: '2h ago',
  },
  {
    id: '2',
    title: 'Ethereum Layer 2 networks see record TVL growth in 2025',
    url: '#',
    source: 'The Block',
    publishedAt: '4h ago',
  },
  {
    id: '3',
    title: 'SEC approves new crypto ETF applications for major altcoins',
    url: '#',
    source: 'Bloomberg',
    publishedAt: '6h ago',
  },
];

export const useCryptoNews = () => {
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('crypto-news');

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        if (data?.success && data?.news?.length > 0) {
          setNews(data.news);
          setError(null);
        } else {
          console.log('Using fallback news data');
        }
      } catch (err) {
        console.error('Failed to fetch crypto news:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch news');
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { news, loading, error };
};
