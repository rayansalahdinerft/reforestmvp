import { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, Settings, Sparkles, TrendingUp } from 'lucide-react';
import { useAppKitAccount, useAppKitNetwork, useAppKit } from '@reown/appkit/react';
import TokenSelectorModal from './TokenSelectorModal';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { getTokensForChain, type Token } from '@/config/tokens';
import { CHAIN_INFO } from '@/config/chains';
import { useTokenPrices } from '@/hooks/useTokenPrices';

const FEE_PERCENT = 0.01;

const SwapCard = () => {
  const [sellAmount, setSellAmount] = useState('');
  const [sellToken, setSellToken] = useState<Token | null>(null);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [chainId, setChainId] = useState<number | string>(1);
  const [modalOpen, setModalOpen] = useState<'sell' | 'buy' | null>(null);

  const { isConnected } = useAppKitAccount();
  const { chainId: walletChainId } = useAppKitNetwork();
  const { open } = useAppKit();

  const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO];

  useEffect(() => {
    if (walletChainId && typeof walletChainId === 'number') {
      if (walletChainId === 1) {
        setChainId(walletChainId);
      }
    }
  }, [walletChainId]);

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

  // Get live prices
  const { getPrice } = useTokenPrices(
    [sellToken?.symbol, buyToken?.symbol].filter(Boolean) as string[]
  );

  const handleSwapTokens = () => {
    const tempToken = sellToken;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(quote?.toAmount || '');
  };

  const handleSwap = async () => {
    if (!isConnected) {
      open();
      return;
    }
    console.log('Executing swap with 1% fee...');
  };

  const buyAmount = quote?.toAmount || '';
  
  // Calculate USD values with live prices
  const sellPrice = sellToken ? getPrice(sellToken.symbol) : null;
  const buyPrice = buyToken ? getPrice(buyToken.symbol) : null;
  
  const sellUsdValue = sellAmount && sellPrice 
    ? (parseFloat(sellAmount) * sellPrice).toFixed(2) 
    : sellAmount ? (parseFloat(sellAmount) * 2500).toFixed(2) : '0';
  const buyUsdValue = buyAmount && buyPrice 
    ? (parseFloat(buyAmount) * buyPrice).toFixed(2) 
    : buyAmount ? (parseFloat(buyAmount) * 2500).toFixed(2) : '0';
  const feeAmount = parseFloat(sellUsdValue) * FEE_PERCENT;

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (!sellToken || !buyToken) return 'Select Token';
    if (!sellAmount) return 'Enter Amount';
    return 'Swap & Plant Trees 🌱';
  };

  const isButtonDisabled = isConnected && (!sellAmount || !sellToken || !buyToken);

  return (
    <div className="w-full max-w-[460px] mx-auto animate-slide-up">
      {/* Card */}
      <div className="swap-card p-1.5">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Swap on</span>
            </div>
            <button 
              onClick={() => setModalOpen('sell')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/80 hover:bg-secondary transition-all font-semibold text-sm group"
            >
              {chainInfo?.logoURI && (
                <img src={chainInfo.logoURI} alt={chainInfo.name} className="w-5 h-5 rounded-full" />
              )}
              <span>{chainInfo?.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
          <button className="p-2.5 hover:bg-secondary rounded-xl transition-all hover:rotate-45 duration-300">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Sell Section */}
        <div className="px-4 pb-2">
          <div className="token-input-row">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">You Pay</span>
              {sellAmount && (
                <span className="text-xs font-medium text-muted-foreground">${sellUsdValue}</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0.00"
                className="swap-input flex-1"
              />
              <button
                onClick={() => setModalOpen('sell')}
                className="token-selector-btn"
              >
                {sellToken?.logoURI && (
                  <img src={sellToken.logoURI} alt={sellToken.symbol} className="w-7 h-7 rounded-full ring-2 ring-border" />
                )}
                <span className="text-base">{sellToken?.symbol || 'Select'}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="w-12 h-12 rounded-2xl bg-card border-4 border-background flex items-center justify-center hover:bg-secondary transition-all duration-300 hover:rotate-180 group shadow-lg"
          >
            <ArrowDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Buy Section */}
        <div className="px-4 pt-2 pb-4">
          <div className="token-input-row bg-primary/5 border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">You Receive</span>
              {buyAmount && (
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">${buyUsdValue}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              {quoteLoading ? (
                <div className="h-10 w-40 bg-muted animate-shimmer rounded-xl" />
              ) : buyAmount ? (
                <span className="swap-input text-primary">{parseFloat(buyAmount).toFixed(6)}</span>
              ) : (
                <span className="text-3xl font-semibold text-muted-foreground/50">0.00</span>
              )}
              <button
                onClick={() => setModalOpen('buy')}
                className="token-selector-btn"
              >
                {buyToken ? (
                  <>
                    {buyToken.logoURI && (
                      <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-7 h-7 rounded-full ring-2 ring-border" />
                    )}
                    <span className="text-base">{buyToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-primary font-bold">Select +</span>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Fee Info */}
        {sellAmount && parseFloat(sellAmount) > 0 && (
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs">🌱</span>
                </div>
                <span className="text-sm font-medium text-foreground">1% goes to reforestation</span>
              </div>
              <span className="text-sm font-bold text-primary">${feeAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleSwap}
            disabled={isButtonDisabled}
            className="w-full premium-button"
          >
            {getButtonText()}
          </button>
        </div>
      </div>

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
