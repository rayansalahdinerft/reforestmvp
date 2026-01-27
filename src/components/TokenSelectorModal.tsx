import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { getTokensForChain, type Token } from '@/config/tokens';

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
  const [search, setSearch] = useState('');

  const tokens = useMemo(() => getTokensForChain(chainId), [chainId]);

  const filteredTokens = useMemo(() => {
    if (!search) return tokens;
    const query = search.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
    );
  }, [tokens, search]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose();
    setSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Select a token</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto space-y-1 mt-2">
          {filteredTokens.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tokens found</p>
          ) : (
            filteredTokens.map((token) => (
              <button
                key={`${token.chainId}-${token.address}`}
                onClick={() => handleSelect(token)}
                disabled={selectedToken?.address === token.address}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  selectedToken?.address === token.address
                    ? 'bg-primary/10 cursor-not-allowed'
                    : 'hover:bg-secondary'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
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
                    <span className="text-sm font-bold">{token.symbol[0]}</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">{token.symbol}</p>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelectorModal;
