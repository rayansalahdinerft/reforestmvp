import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Newspaper } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

// Mock news data - in production, this would come from an API
const MOCK_NEWS: NewsItem[] = [
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
  {
    id: '4',
    title: 'DeFi protocols reach $500B in total value locked',
    url: '#',
    source: 'DeFi Pulse',
    publishedAt: '8h ago',
  },
  {
    id: '5',
    title: 'Major banks announce blockchain-based cross-border payments',
    url: '#',
    source: 'Reuters',
    publishedAt: '10h ago',
  },
  {
    id: '6',
    title: 'Solana ecosystem expands with new gaming partnerships',
    url: '#',
    source: 'CryptoSlate',
    publishedAt: '12h ago',
  },
];

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full bg-card/50 border-y border-border overflow-hidden">
      <div className="flex items-center">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 border-r border-border shrink-0">
          <Newspaper className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">News</span>
        </div>

        {/* Scrolling ticker */}
        <div 
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex gap-8 py-3 ${isPaused ? '' : 'animate-ticker'}`}
            style={{
              animation: isPaused ? 'none' : 'ticker 60s linear infinite',
            }}
          >
            {[...news, ...news].map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 whitespace-nowrap hover:text-primary transition-colors group shrink-0"
              >
                <span className="text-xs text-muted-foreground font-medium">{item.source}</span>
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </span>
                <span className="text-xs text-muted-foreground">{item.publishedAt}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
