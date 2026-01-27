import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Token } from '@/config/tokens';

interface TokenSelectorProps {
  label: string;
  selectedToken?: Token | null;
  amount: string;
  usdValue: string;
  onAmountChange: (value: string) => void;
  onTokenSelect: () => void;
  readOnly?: boolean;
  loading?: boolean;
}

const TokenSelector = forwardRef<HTMLDivElement, TokenSelectorProps>(
  (
    {
      label,
      selectedToken,
      amount,
      usdValue,
      onAmountChange,
      onTokenSelect,
      readOnly = false,
      loading = false,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="glass-card rounded-2xl p-5 transition-all duration-200 hover:border-primary/30"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onTokenSelect}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-200 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center overflow-hidden">
              {selectedToken?.logoURI ? (
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-7 h-7 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary/20" />
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-foreground">
                {selectedToken?.symbol || 'Select Token'}
              </span>
              <span className="text-xs text-primary">
                {selectedToken?.name || 'Required'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          <div className="flex-1 text-right">
            {loading ? (
              <div className="h-9 bg-secondary/50 rounded-lg animate-pulse" />
            ) : (
              <input
                type="text"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder="0.0"
                readOnly={readOnly}
                className="swap-input text-right"
              />
            )}
            <p className="text-sm text-muted-foreground mt-1">${usdValue}</p>
          </div>
        </div>
      </div>
    );
  }
);

TokenSelector.displayName = 'TokenSelector';

export default TokenSelector;
