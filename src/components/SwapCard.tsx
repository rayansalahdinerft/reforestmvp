import { useState, useEffect } from 'react';
import { ArrowUpDown, Info, Leaf, Loader2, TreePine } from 'lucide-react';
import { useAppKitAccount, useAppKitNetwork, useAppKit } from '@reown/appkit/react';
import { Button } from './ui/button';
import TokenSelector from './TokenSelector';
import TokenSelectorModal from './TokenSelectorModal';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { getTokensForChain, type Token } from '@/config/tokens';
import { CHAIN_INFO } from '@/config/chains';

// Fee and impact constants
const FEE_PERCENT = 0.01; // 1%
const REFOREST_PERCENT = 0.40; // 40% of fees go to reforestation
const COST_PER_TREE_USD = 2.5;

const SwapCard = () => {
  const [sellAmount, setSellAmount] = useState('');
  const [sellToken, setSellToken] = useState<Token | null>(null);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [chainId, setChainId] = useState<number | string>(1);
  const [modalOpen, setModalOpen] = useState<'sell' | 'buy' | null>(null);

  const { isConnected } = useAppKitAccount();
  const { chainId: walletChainId } = useAppKitNetwork();
  const { open } = useAppKit();

  const isSolana = chainId === 'solana';
  const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO];

  // Sync chain with wallet (only for EVM)
  useEffect(() => {
    if (walletChainId && typeof walletChainId === 'number' && !isSolana) {
      if (walletChainId === 1) {
        setChainId(walletChainId);
      }
    }
  }, [walletChainId, isSolana]);

  // Reset tokens when chain changes
  useEffect(() => {
    const tokens = getTokensForChain(chainId);
    setSellToken(tokens[0] || null);
    setBuyToken(tokens[1] || null);
    setSellAmount('');
  }, [chainId]);

  const { quote, loading: quoteLoading } = useSwapQuote(
    sellToken,
    buyToken,
    sellAmount,
    chainId
  );

  const handleSwapTokens = () => {
    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(quote?.toAmount || '');
  };

  const handleSwap = async () => {
    if (!isConnected && !isSolana) {
      open();
      return;
    }
    // TODO: Implement actual swap with fee-splitter contract
    console.log('Executing swap with 1% fee...');
  };

  const buyAmount = quote?.toAmount || '';
  
  // Calculate USD values (using mock price for demo)
  const sellUsdValue = sellAmount ? (parseFloat(sellAmount) * 2500).toFixed(2) : '0';
  const buyUsdValue = buyAmount ? (parseFloat(buyAmount) * 2500).toFixed(2) : '0';

  // Calculate impact
  const amountUSD = parseFloat(sellUsdValue) || 0;
  const feeAmount = amountUSD * FEE_PERCENT;
  const reforestAmount = feeAmount * REFOREST_PERCENT;
  const treesPlanted = reforestAmount / COST_PER_TREE_USD;

  const getButtonText = () => {
    if (!isConnected) {
      return 'Connect Wallet';
    }
    if (quoteLoading) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }
    if (!sellAmount) {
      return 'Enter amount';
    }
    return 'Swap';
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      {/* Header - Clean title */}
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-lg font-semibold text-foreground">Swap</h2>
      </div>

      {/* Swap Container */}
      <div
        className="glass-card rounded-3xl p-4 relative"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
          style={{ background: 'var(--gradient-glow)' }}
        />

        <div className="relative space-y-2">
          {/* Sell Token */}
          <TokenSelector
            label="Sell"
            selectedToken={sellToken}
            amount={sellAmount}
            usdValue={sellUsdValue}
            onAmountChange={setSellAmount}
            onTokenSelect={() => setModalOpen('sell')}
          />

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapTokens}
              className="w-10 h-10 rounded-xl bg-card border-4 border-background flex items-center justify-center hover:bg-secondary transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Buy Token */}
          <TokenSelector
            label="Buy"
            selectedToken={buyToken}
            amount={buyAmount}
            usdValue={buyUsdValue}
            onAmountChange={() => {}}
            onTokenSelect={() => setModalOpen('buy')}
            readOnly
            loading={quoteLoading}
          />

          {/* Fee Info */}
          <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Leaf className="w-3 h-3 text-primary" />
              <span>1% ReforestWallet fee • {isSolana ? 'Jupiter' : '1inch'} DEX</span>
              <Info className="w-3 h-3 ml-auto cursor-help" />
            </div>
            
            {quote && (
              <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Rate</span>
                  <span className="text-foreground">
                    1 {sellToken?.symbol} ≈{' '}
                    {(parseFloat(buyAmount) / parseFloat(sellAmount)).toFixed(4)}{' '}
                    {buyToken?.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground flex items-center gap-1">
                    <span>{chainInfo?.icon}</span>
                    {chainInfo?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Impact Display */}
            {amountUSD > 0 && (
              <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Fee (1%)</span>
                  <span className="text-foreground">${feeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">To reforestation (40%)</span>
                  <span className="text-primary">${reforestAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TreePine className="w-3 h-3 text-primary" />
                    Trees planted
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {treesPlanted >= 1 
                      ? `~${Math.floor(treesPlanted)} 🌱` 
                      : treesPlanted > 0 
                        ? `~${treesPlanted.toFixed(2)} 🌱`
                        : '0'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Swap Button */}
          <Button
            variant="swap"
            size="full"
            className="mt-4"
            onClick={handleSwap}
            disabled={isConnected && (!sellAmount || !sellToken || !buyToken)}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>

      {/* Eco message */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Every swap plants trees 🌱
      </p>

      {/* Token Selector Modals */}
      <TokenSelectorModal
        isOpen={modalOpen === 'sell'}
        onClose={() => setModalOpen(null)}
        onSelect={setSellToken}
        chainId={chainId}
        selectedToken={buyToken}
        onChainChange={setChainId}
      />
      <TokenSelectorModal
        isOpen={modalOpen === 'buy'}
        onClose={() => setModalOpen(null)}
        onSelect={setBuyToken}
        chainId={chainId}
        selectedToken={sellToken}
        onChainChange={setChainId}
      />
    </div>
  );
};

export default SwapCard;
