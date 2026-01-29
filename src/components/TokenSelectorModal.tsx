import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { getTokensForChain, type Token } from '@/config/tokens';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  chainId: number | string;
  selectedToken?: Token | null;
}

const TokenSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
  chainId,
  selectedToken,
}: TokenSelectorModalProps) => {
  const [tokenSearch, setTokenSearch] = useState('');

  const tokens = useMemo(() => getTokensForChain(chainId), [chainId]);

  const filteredTokens = useMemo(() => {
    if (!tokenSearch) return tokens;
    const query = tokenSearch.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
    );
  }, [tokens, tokenSearch]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose();
    setTokenSearch('');
  };

  const handleClose = () => {
    onClose();
    setTokenSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md p-0 gap-0 overflow-hidden" aria-describedby={undefined}>
        <VisuallyHidden>
          <DialogTitle>Select a token</DialogTitle>
        </VisuallyHidden>
        
        <div className="flex flex-col h-[520px]">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Select token</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or symbol"
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                className="pl-9 bg-secondary/50 border-border focus:border-foreground text-foreground placeholder:text-muted-foreground h-10"
                autoFocus
              />
              {tokenSearch && (
                <button
                  onClick={() => setTokenSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Token List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredTokens.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">No tokens found</p>
              ) : (
                filteredTokens.map((token) => (
                  <button
                    key={`${token.chainId}-${token.address}`}
                    onClick={() => handleSelect(token)}
                    disabled={selectedToken?.address === token.address}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      selectedToken?.address === token.address
                        ? 'bg-secondary/50 cursor-not-allowed opacity-50'
                        : 'hover:bg-secondary/50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                      {token.logoURI ? (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-sm font-bold text-foreground">{token.symbol[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                    {selectedToken?.address === token.address && (
                      <Check className="w-5 h-5 text-accent" />
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelectorModal;
