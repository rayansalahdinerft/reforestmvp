import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import AdvancedChart from './AdvancedChart';
import type { MarketToken } from '@/hooks/useMarketData';

interface TokenDetailModalProps {
  token: MarketToken | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TokenDetailModal = ({ token, open, onOpenChange }: TokenDetailModalProps) => {
  const change24h = token?.price_change_percentage_24h ?? 0;
  const isPositive = change24h >= 0;

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) return 'N/A';
    if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (price >= 0.0001) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
    return price.toExponential(2);
  };

  const formatMarketCap = (value: number | undefined) => {
    if (!value) return 'N/A';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  if (!token) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={token.image} 
              alt={token.symbol} 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <span className="text-foreground">{token.name}</span>
              <span className="text-muted-foreground ml-2 uppercase">{token.symbol}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Price & Stats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-foreground tabular-nums">
                ${formatPrice(token.current_price)}
              </p>
              <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium tabular-nums">
                  {isPositive ? '+' : ''}{change24h.toFixed(2)}% (24h)
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Market Cap: {formatMarketCap(token.market_cap)}</p>
              <p>24h Volume: {formatMarketCap(token.total_volume)}</p>
            </div>
          </div>

          {/* Advanced chart with candles + volume + live WS */}
          <AdvancedChart symbol={token.symbol.toUpperCase()} height={380} />

          {/* CoinGecko link */}
          <a 
            href={`https://www.coingecko.com/en/coins/${token.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View on CoinGecko <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenDetailModal;
