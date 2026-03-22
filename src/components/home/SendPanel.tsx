import { useState } from 'react';
import { X, ArrowRight, ChevronDown, Search } from 'lucide-react';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { toast } from 'sonner';

interface SendPanelProps {
  onClose: () => void;
  address: string | null;
}

const SendPanel = ({ onClose, address }: SendPanelProps) => {
  const { balances } = useWalletBalance();
  const [selectedToken, setSelectedToken] = useState(balances[0] ?? null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showTokenList, setShowTokenList] = useState(false);
  const [tokenSearch, setTokenSearch] = useState('');

  const sortedBalances = [...balances].sort((a, b) => b.balanceUsd - a.balanceUsd);
  const filteredBalances = sortedBalances.filter(t =>
    t.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.name.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  const maxAmount = selectedToken ? parseFloat(selectedToken.balance) : 0;

  const handleSetMax = () => {
    if (selectedToken) {
      setAmount(selectedToken.balance);
    }
  };

  const handleSend = () => {
    if (!recipientAddress) {
      toast.error('Entrez une adresse de destination');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Entrez un montant');
      return;
    }
    if (parseFloat(amount) > maxAmount) {
      toast.error('Solde insuffisant');
      return;
    }
    toast.info('Fonctionnalité bientôt disponible — la signature de transaction sera ajoutée prochainement.');
  };

  const amountUsd = selectedToken ? parseFloat(amount || '0') * selectedToken.price : 0;

  const presetPercentages = [25, 50, 75, 100];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-border/30">
        <h2 className="text-xl font-bold text-foreground">Envoyer</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-90 transition-transform">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-5 pt-5 space-y-5 overflow-y-auto pb-32">
        {/* Token selector */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Token</label>
          <button
            onClick={() => setShowTokenList(!showTokenList)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-card border border-border/60 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-3">
              {selectedToken?.logoURI ? (
                <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                  {selectedToken?.symbol?.slice(0, 3) ?? '?'}
                </div>
              )}
              <div className="text-left">
                <p className="font-bold text-sm text-foreground">{selectedToken?.symbol ?? 'Sélectionner'}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  Solde: {selectedToken?.balance ?? '0'} {selectedToken?.symbol}
                </p>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showTokenList ? 'rotate-180' : ''}`} />
          </button>

          {showTokenList && (
            <div className="mt-2 rounded-2xl bg-card border border-border overflow-hidden shadow-lg">
              <div className="p-3 border-b border-border/30">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={tokenSearch}
                    onChange={(e) => setTokenSearch(e.target.value)}
                    placeholder="Rechercher un token..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                </div>
              </div>
              <div className="max-h-[240px] overflow-y-auto">
                {filteredBalances.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => { setSelectedToken(token); setShowTokenList(false); setTokenSearch(''); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 active:bg-secondary transition-colors ${
                      selectedToken?.symbol === token.symbol ? 'bg-primary/5' : ''
                    }`}
                  >
                    {token.logoURI ? (
                      <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                        {token.symbol.slice(0, 3)}
                      </div>
                    )}
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm text-foreground">{token.name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">{token.balance} {token.symbol}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground tabular-nums">€{token.balanceUsd.toFixed(2)}</p>
                  </button>
                ))}
                {filteredBalances.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-6">Aucun token trouvé</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Recipient */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Adresse du destinataire</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x... ou nom ENS"
            className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border/60 text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
          />
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Montant</label>
          </div>
          <div className="rounded-2xl bg-card border border-border/60 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-2xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none tabular-nums"
              />
              <span className="text-sm font-semibold text-muted-foreground">{selectedToken?.symbol ?? ''}</span>
            </div>
            {amount && (
              <p className="text-xs text-muted-foreground tabular-nums">≈ €{amountUsd.toFixed(2)} EUR</p>
            )}
            {/* Preset percentages */}
            <div className="flex gap-2">
              {presetPercentages.map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    if (selectedToken) {
                      setAmount((maxAmount * pct / 100).toString());
                    }
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-secondary/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95 transition-all"
                >
                  {pct === 100 ? 'MAX' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        {amount && parseFloat(amount) > 0 && recipientAddress && (
          <div className="rounded-2xl bg-secondary/30 border border-border/30 p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Résumé</p>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Montant</span>
              <span className="text-foreground font-medium tabular-nums">{parseFloat(amount).toFixed(6)} {selectedToken?.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valeur</span>
              <span className="text-foreground font-medium tabular-nums">≈ €{amountUsd.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Destinataire</span>
              <span className="text-foreground font-mono text-xs">{recipientAddress.slice(0, 8)}...{recipientAddress.slice(-6)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Send button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 bg-background/80 backdrop-blur-xl border-t border-border/30">
        <button
          onClick={handleSend}
          disabled={!recipientAddress || !amount || parseFloat(amount) <= 0}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-primary/20"
        >
          Envoyer
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SendPanel;
