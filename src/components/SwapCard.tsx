import { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, Settings, Info } from 'lucide-react';
import { useAppKitAccount, useAppKitNetwork, useAppKit } from '@reown/appkit/react';
import TokenSelectorModal from './TokenSelectorModal';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { getTokensForChain, type Token } from '@/config/tokens';
import { CHAIN_INFO } from '@/config/chains';

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
  const sellUsdValue = sellAmount ? (parseFloat(sellAmount) * 2500).toFixed(2) : '0';
  const buyUsdValue = buyAmount ? (parseFloat(buyAmount) * 2500).toFixed(2) : '0';
  const feeAmount = parseFloat(sellUsdValue) * FEE_PERCENT;

  const getButtonText = () => {
    if (!isConnected) return 'Connect wallet';
    if (!sellToken || !buyToken) return 'Select token';
    if (!sellAmount) return 'Enter amount';
    return 'Swap';
  };

  const isButtonDisabled = isConnected && (!sellAmount || !sellToken || !buyToken);

  return (
    <div className="w-full max-w-[480px] mx-auto animate-slide-up">
      {/* Card */}
      <div className="swap-card p-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Pay on</span>
            <button 
              onClick={() => setModalOpen('sell')}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              {chainInfo?.logoURI && (
                <img src={chainInfo.logoURI} alt={chainInfo.name} className="w-4 h-4 rounded-full" />
              )}
              {chainInfo?.name}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Sell Section */}
        <div className="px-4 pb-2">
          <div className="token-input-row">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                placeholder="0"
                className="swap-input flex-1"
              />
              <button
                onClick={() => setModalOpen('sell')}
                className="token-selector-btn"
              >
                {sellToken?.logoURI && (
                  <img src={sellToken.logoURI} alt={sellToken.symbol} className="w-6 h-6 rounded-full" />
                )}
                <span>{sellToken?.symbol || 'Select'}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {sellAmount && (
              <p className="text-sm text-muted-foreground mt-2">${sellUsdValue}</p>
            )}
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Buy Section */}
        <div className="px-4 pt-2 pb-4">
          <div className="token-input-row">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Receive</span>
            </div>
            <div className="flex items-center justify-between">
              {quoteLoading ? (
                <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              ) : buyAmount ? (
                <span className="swap-input">{parseFloat(buyAmount).toFixed(6)}</span>
              ) : (
                <span className="text-2xl font-medium text-muted-foreground">0</span>
              )}
              <button
                onClick={() => setModalOpen('buy')}
                className="token-selector-btn"
              >
                {buyToken ? (
                  <>
                    {buyToken.logoURI && (
                      <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-6 h-6 rounded-full" />
                    )}
                    <span>{buyToken.symbol}</span>
                  </>
                ) : (
                  <span className="text-primary font-semibold">SELECT TOKEN +</span>
                )}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {buyAmount && (
              <p className="text-sm text-muted-foreground mt-2">${buyUsdValue}</p>
            )}
          </div>
        </div>

        {/* Fee Info */}
        {sellAmount && parseFloat(sellAmount) > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                1% ReforestWallet fee
              </span>
              <span className="text-foreground">${feeAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleSwap}
            disabled={isButtonDisabled}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
