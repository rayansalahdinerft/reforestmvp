import { useState } from 'react';
import { ExternalLink, Newspaper, Loader2 } from 'lucide-react';
import { useCryptoNews } from '@/hooks/useCryptoNews';

const NewsTicker = () => {
  const { news, loading } = useCryptoNews();
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full bg-gradient-to-r from-card/80 via-card/60 to-card/80 border-y border-border/50 overflow-hidden backdrop-blur-sm">
      <div className="flex items-center">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border-r border-border/50 shrink-0">
          {loading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <Newspaper className="w-4 h-4 text-primary animate-subtle-bounce" />
          )}
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Live</span>
        </div>

        {/* Scrolling ticker */}
        <div 
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`flex gap-8 py-2.5 ${isPaused ? '' : 'animate-ticker'}`}
            style={{
              animation: isPaused ? 'none' : 'ticker 30s linear infinite',
            }}
          >
            {[...news, ...news].map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 whitespace-nowrap hover:text-primary transition-colors group shrink-0"
              >
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider opacity-60">{item.source}</span>
                <span className="text-xs text-foreground group-hover:text-primary transition-colors font-medium">
                  {item.title}
                </span>
                <span className="text-[10px] text-muted-foreground/50">{item.publishedAt}</span>
                <ExternalLink className="w-2.5 h-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="w-1 h-1 rounded-full bg-border" />
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
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
