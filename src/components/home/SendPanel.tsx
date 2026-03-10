import { useState } from 'react';
import { X, ArrowRight, ChevronDown } from 'lucide-react';
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

  const sortedBalances = [...balances].sort((a, b) => b.balanceUsd - a.balanceUsd);

  const maxAmount = selectedToken ? parseFloat(selectedToken.balance) : 0;

  const handleSetMax = () => {
    if (selectedToken) {
      setAmount(selectedToken.balance);
    }
  };

  const handleSend = () => {
    if (!recipientAddress) {
      toast.error('Enter a recipient address');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Enter an amount');
      return;
    }
    if (parseFloat(amount) > maxAmount) {
      toast.error('Insufficient balance');
      return;
    }
    // TODO: implement actual send transaction
    toast.info('Send feature coming soon — transaction signing will be added shortly.');
  };

  const amountUsd = selectedToken ? parseFloat(amount || '0') * selectedToken.price : 0;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
        <h2 className="text-lg font-bold text-foreground">Send</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-4 space-y-4 overflow-y-auto pb-32">
        {/* Token selector */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Token</label>
          <button
            onClick={() => setShowTokenList(!showTokenList)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3">
              {selectedToken?.logoURI ? (
                <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                  {selectedToken?.symbol?.slice(0, 3) ?? '?'}
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold text-sm text-foreground">{selectedToken?.symbol ?? 'Select'}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  Balance: {selectedToken?.balance ?? '0'}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showTokenList && (
            <div className="mt-1.5 rounded-2xl bg-card border border-border overflow-hidden">
              {sortedBalances.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => { setSelectedToken(token); setShowTokenList(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 active:bg-secondary transition-colors"
                >
                  {token.logoURI ? (
                    <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                      {token.symbol.slice(0, 3)}
                    </div>
                  )}
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm text-foreground">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{token.balance}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground tabular-nums">${token.balanceUsd.toFixed(2)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recipient */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Recipient Address</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x... or ENS name"
            className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-muted-foreground">Amount</label>
            <button onClick={handleSetMax} className="text-xs font-semibold text-primary">MAX</button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
            />
          </div>
          {amount && (
            <p className="text-xs text-muted-foreground mt-1 tabular-nums">≈ ${amountUsd.toFixed(2)} USD</p>
          )}
        </div>
      </div>

      {/* Send button */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 bg-background border-t border-border">
        <button
          onClick={handleSend}
          disabled={!recipientAddress || !amount || parseFloat(amount) <= 0}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:pointer-events-none"
        >
          Send
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SendPanel;
