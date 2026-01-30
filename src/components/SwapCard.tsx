import { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, Sparkles, TrendingUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import TokenSelectorModal from './TokenSelectorModal';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { useSwapExecution } from '@/hooks/useSwapExecution';
import { getTokensForChain, type Token } from '@/config/tokens';
import { CHAIN_INFO } from '@/config/chains';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { getContractAddress } from '@/config/contracts';
import { toast } from 'sonner';

const FEE_PERCENT = 0.01;
const CHAIN_ID = 1; // Ethereum mainnet only

const SwapCard = () => {
  const [sellAmount, setSellAmount] = useState('');
  const [sellToken, setSellToken] = useState<Token | null>(null);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [modalOpen, setModalOpen] = useState<'sell' | 'buy' | null>(null);
  const [slippage, setSlippage] = useState(1);

  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();

  const chainInfo = CHAIN_INFO[CHAIN_ID];

  const { 
    status: swapStatus, 
    error: swapError, 
    txHash, 
    executeSwap, 
    reset: resetSwap 
  } = useSwapExecution();

  // Initialize tokens on mount
  useEffect(() => {
    const tokens = getTokensForChain(CHAIN_ID);
    setSellToken(tokens[0] || null); // ETH
    setBuyToken(tokens[2] || null);  // USDC
  }, []);

  const { quote, loading: quoteLoading } = useSwapQuote(
    sellToken,
    buyToken,
    sellAmount,
    CHAIN_ID
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
    resetSwap();
  };

  const handleSwap = async () => {
    if (!isConnected) {
      open();
      return;
    }

    if (!sellToken || !buyToken || !sellAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    const contractAddress = getContractAddress(CHAIN_ID);
    if (!contractAddress) {
      toast.error('Smart contract not deployed yet. Demo mode active.');
      return;
    }

    toast.info('Starting swap...', { id: 'swap-progress' });

    const result = await executeSwap(
      CHAIN_ID,
      sellToken,
      buyToken,
      sellAmount,
      slippage
    );

    if (result.error) {
      toast.error(result.error, { id: 'swap-progress' });
    } else if (result.hash) {
      toast.success(
        <div>
          <p>Swap successful! 🌱</p>
          <p className="text-xs opacity-70">Your fee saves the planet</p>
        </div>,
        { id: 'swap-progress' }
      );
      setSellAmount('');
    }
  };

  const buyAmount = quote?.toAmount || '';
  
  // Calculate USD values with live prices
  const sellPrice = sellToken ? getPrice(sellToken.symbol) : null;
  const buyPrice = buyToken ? getPrice(buyToken.symbol) : null;
  
  const sellUsdValue = sellAmount && sellPrice 
    ? (parseFloat(sellAmount) * sellPrice).toFixed(2) 
    : null;
  const buyUsdValue = buyAmount && buyPrice 
    ? (parseFloat(buyAmount) * buyPrice).toFixed(2) 
    : null;
  const feeAmount = sellUsdValue ? parseFloat(sellUsdValue) * FEE_PERCENT : 0;
  const reforestationAmount = feeAmount * 0.40; // 40% of fee goes to NGO
  const treesPlanted = reforestationAmount / 2.5; // $2.50 per tree

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (!sellToken || !buyToken) return 'Select Token';
    if (!sellAmount) return 'Enter Amount';
    
    switch (swapStatus) {
      case 'fetching-quote': return 'Getting quote...';
      case 'approving': return 'Approving token...';
      case 'swapping': return 'Swapping...';
      case 'success': return 'Swap Successful! 🌱';
      case 'error': return 'Try Again';
      default: return 'Swap & Plant Trees 🌱';
    }
  };

  const getButtonIcon = () => {
    switch (swapStatus) {
      case 'fetching-quote':
      case 'approving':
      case 'swapping':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const isButtonDisabled = isConnected && (
    !sellAmount || 
    !sellToken || 
    !buyToken || 
    swapStatus === 'fetching-quote' || 
    swapStatus === 'approving' || 
    swapStatus === 'swapping'
  );

  const isContractDeployed = getContractAddress(CHAIN_ID) !== null;

  // Get block explorer URL
  const getExplorerTxUrl = () => {
    if (!txHash) return '';
    return `${chainInfo?.blockExplorer || 'https://etherscan.io'}/tx/${txHash}`;
  };

  return (
    <div className="w-full max-w-[460px] mx-auto animate-slide-up">
      {/* Card */}
      <div className="swap-card p-1.5">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Swap on</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/80 font-semibold text-sm">
              {chainInfo?.logoURI && (
                <img src={chainInfo.logoURI} alt={chainInfo.name} className="w-5 h-5 rounded-full" />
              )}
              <span>{chainInfo?.name}</span>
            </div>
          </div>
          
          {/* Slippage Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Slippage:</span>
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5">
              {[0.5, 1, 2].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    slippage === value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <div className="relative">
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && val >= 0.1 && val <= 50) {
                      setSlippage(val);
                    }
                  }}
                  className="w-12 px-1.5 py-1 text-xs font-medium text-center bg-secondary rounded-md border-none outline-none focus:ring-1 focus:ring-primary"
                  min="0.1"
                  max="50"
                  step="0.1"
                />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo mode indicator */}
        {!isContractDeployed && (
          <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              ⚠️ Demo mode: Contract not deployed
            </p>
          </div>
        )}

        {/* Sell Section */}
        <div className="px-4 pb-2">
          <div className="token-input-row">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">You Pay</span>
              {sellAmount && sellUsdValue && (
                <span className="text-xs font-medium text-muted-foreground">${sellUsdValue}</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={sellAmount}
                onChange={(e) => {
                  setSellAmount(e.target.value);
                  if (swapStatus === 'error' || swapStatus === 'success') {
                    resetSwap();
                  }
                }}
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
              {buyAmount && buyUsdValue && (
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
                <div>
                  <span className="text-sm font-medium text-foreground">Your fee saves the planet</span>
                  {treesPlanted > 0 && (
                    <p className="text-[10px] text-muted-foreground">≈ {treesPlanted.toFixed(2)} trees funded</p>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold text-primary">${reforestationAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {swapError && (
          <div className="px-5 pb-4">
            <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive">{swapError}</p>
            </div>
          </div>
        )}

        {/* Transaction Hash */}
        {txHash && (
          <div className="px-5 pb-4">
            <a 
              href={getExplorerTxUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
            >
              <p className="text-xs text-primary truncate">View transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}</p>
            </a>
          </div>
        )}

        {/* Swap Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleSwap}
            disabled={isButtonDisabled}
            className="w-full premium-button flex items-center justify-center gap-2"
          >
            {getButtonIcon()}
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* Token Selector Modals - Ethereum only */}
      <TokenSelectorModal
        isOpen={modalOpen === 'sell'}
        onClose={() => setModalOpen(null)}
        onSelect={setSellToken}
        chainId={CHAIN_ID}
        selectedToken={buyToken}
      />
      <TokenSelectorModal
        isOpen={modalOpen === 'buy'}
        onClose={() => setModalOpen(null)}
        onSelect={setBuyToken}
        chainId={CHAIN_ID}
        selectedToken={sellToken}
      />
    </div>
  );
};

export default SwapCard;
