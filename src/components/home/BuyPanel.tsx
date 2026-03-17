import { X, Search, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BuyPanelProps {
  onClose: () => void;
  address: string | null;
}

interface CryptoItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

const TOP_CRYPTOS = [
  'bitcoin', 'ethereum', 'tether', 'binancecoin', 'solana',
  'usd-coin', 'ripple', 'cardano', 'dogecoin', 'avalanche-2',
  'tron', 'chainlink', 'polkadot', 'matic-network', 'shiba-inu',
  'dai', 'uniswap', 'litecoin', 'pepe', 'aave',
  'render-token', 'arbitrum', 'fetch-ai', 'the-graph', 'maker',
  'lido-dao', 'optimism-ethereum', 'pendle', 'starknet', 'ondo-finance',
];

const BuyPanel = ({ onClose, address }: BuyPanelProps) => {
  const [search, setSearch] = useState('');
  const [cryptos, setCryptos] = useState<CryptoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data } = await supabase.functions.invoke('coingecko-markets', {
          body: { vs_currency: 'usd', per_page: 50, page: 1 },
        });
        if (data && Array.isArray(data)) {
          setCryptos(data);
        }
      } catch (e) {
        console.error('Failed to fetch prices:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const filtered = cryptos.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const openBuy = (crypto: CryptoItem) => {
    const url = `https://global.transak.com/?apiKey=af3a8236-5c7e-4dcd-b25c-c15a0e2ef74e&cryptoCurrencyCode=${crypto.symbol.toUpperCase()}&walletAddress=${address ?? ''}&network=ethereum&hideMenu=true&themeColor=22c55e`;
    window.open(url, '_blank');
  };

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 0.01) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(8)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <h2 className="text-lg font-bold text-foreground">Buy Crypto</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search crypto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((crypto, i) => (
              <button
                key={crypto.id}
                onClick={() => openBuy(crypto)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/50 hover:bg-card active:scale-[0.98] transition-all"
              >
                {/* Rank */}
                <span className="text-[10px] text-muted-foreground w-5 text-right font-medium">
                  {crypto.market_cap_rank || i + 1}
                </span>

                {/* Logo */}
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-9 h-9 rounded-full"
                  loading="lazy"
                />

                {/* Name */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{crypto.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
                </div>

                {/* Price & Change */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground">{formatPrice(crypto.current_price)}</p>
                  <div className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-primary' : 'text-destructive'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPanel;
