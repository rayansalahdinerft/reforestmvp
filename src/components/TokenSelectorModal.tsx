import { useState, useMemo } from 'react';
import { Search, X, Info } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { getTokensForChain, type Token } from '@/config/tokens';
import { CHAIN_INFO, type SupportedChainId } from '@/config/chains';

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  chainId: number | string;
  selectedToken?: Token | null;
  onChainChange?: (chainId: number | string) => void;
}

const TokenSelectorModal = ({
  isOpen,
  onClose,
  onSelect,
  chainId,
  selectedToken,
  onChainChange,
}: TokenSelectorModalProps) => {
  const [tokenSearch, setTokenSearch] = useState('');
  const [chainSearch, setChainSearch] = useState('');

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

  const filteredChains = useMemo(() => {
    const chains = Object.entries(CHAIN_INFO);
    if (!chainSearch) return chains;
    const query = chainSearch.toLowerCase();
    return chains.filter(([, info]) =>
      info.name.toLowerCase().includes(query)
    );
  }, [chainSearch]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose();
    setTokenSearch('');
    setChainSearch('');
  };

  const handleChainSelect = (newChainId: string) => {
    if (onChainChange) {
      onChainChange(newChainId === 'solana' ? 'solana' : Number(newChainId));
    }
  };

  const handleClose = () => {
    onClose();
    setTokenSearch('');
    setChainSearch('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0c0c0c] border-border/50 max-w-3xl p-0 gap-0 overflow-hidden">
        <div className="flex h-[500px]">
          {/* Left Panel - Chain Selection */}
          <div className="w-64 border-r border-border/30 flex flex-col bg-[#0a0a0a]">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search Chain"
                  value={chainSearch}
                  onChange={(e) => setChainSearch(e.target.value)}
                  className="pl-10 bg-transparent border-border/50 text-foreground placeholder:text-muted-foreground h-10"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-2 pb-4">
                {filteredChains.map(([id, info]) => (
                  <button
                    key={id}
                    onClick={() => handleChainSelect(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      String(chainId) === id
                        ? 'bg-primary/10 text-foreground'
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {info.logoURI ? (
                      <img
                        src={info.logoURI}
                        alt={info.name}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-lg">{info.icon}</span>
                    )}
                    <span className="font-medium text-sm">{info.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Token Selection */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border/30">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-foreground">Select Token</h2>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-secondary rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select a token from the list or use the search
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by token or address"
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  className="pl-10 bg-transparent border-primary/50 focus:border-primary text-foreground placeholder:text-muted-foreground h-11"
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

            <ScrollArea className="flex-1">
              <div className="p-2">
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
                          ? 'bg-primary/10 cursor-not-allowed opacity-50'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {token.logoURI ? (
                          <img
                            src={token.logoURI}
                            alt={token.symbol}
                            className="w-9 h-9 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-sm font-bold text-foreground">{token.symbol[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.name}</p>
                      </div>
                      <Info className="w-4 h-4 text-muted-foreground/50" />
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelectorModal;
