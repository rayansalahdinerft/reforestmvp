import { useState, useEffect } from 'react';
import { ExternalLink, ArrowRightLeft, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export interface SwapHistoryEntry {
  id: string;
  timestamp: number;
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  txHash: string;
  status: 'success' | 'failed';
  chainId: number;
  donationUsd: number;
}

const STORAGE_KEY = 'reforest_swap_history';
const MAX_ENTRIES = 20;

export const addSwapToHistory = (entry: Omit<SwapHistoryEntry, 'id'>) => {
  const history = getSwapHistory();
  const newEntry: SwapHistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('swap-history-updated'));
};

export const getSwapHistory = (): SwapHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getExplorerUrl = (txHash: string, chainId: number) => {
  const explorers: Record<number, string> = {
    1: 'https://etherscan.io',
  };
  const base = explorers[chainId] || 'https://etherscan.io';
  return `${base}/tx/${txHash}`;
};

const formatTimeAgo = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const SwapHistory = () => {
  const [history, setHistory] = useState<SwapHistoryEntry[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setHistory(getSwapHistory());

    const handler = () => setHistory(getSwapHistory());
    window.addEventListener('swap-history-updated', handler);
    return () => window.removeEventListener('swap-history-updated', handler);
  }, []);

  if (history.length === 0) return null;

  const displayed = expanded ? history : history.slice(0, 3);

  return (
    <div className="w-full max-w-[460px] mx-auto mt-4 px-1 sm:px-0 animate-fade-in">
      <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Recent Swaps</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
              {history.length}
            </span>
          </div>
          {history.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? 'Less' : 'All'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Entries */}
        <div className="divide-y divide-border/20">
          {displayed.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  entry.status === 'success' ? 'bg-primary/15' : 'bg-destructive/15'
                }`}>
                  <ArrowRightLeft className={`w-3.5 h-3.5 ${
                    entry.status === 'success' ? 'text-primary' : 'text-destructive'
                  }`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-foreground truncate">
                      {parseFloat(entry.sellAmount).toFixed(4)} {entry.sellToken}
                    </span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="text-sm font-medium text-primary truncate">
                      {parseFloat(entry.buyAmount).toFixed(4)} {entry.buyToken}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{formatTimeAgo(entry.timestamp)}</span>
                    {entry.donationUsd > 0 && (
                      <span className="text-[10px] text-primary/80">🌱 ${entry.donationUsd.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
              <a
                href={getExplorerUrl(entry.txHash, entry.chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0"
                title="View on explorer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwapHistory;
