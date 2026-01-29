import { useState, useEffect } from 'react';
import { ArrowDown, ChevronDown, Settings, Sparkles, TrendingUp, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppKitAccount, useAppKitNetwork, useAppKit } from '@reown/appkit/react';
import TokenSelectorModal from './TokenSelectorModal';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { useSwapExecution } from '@/hooks/useSwapExecution';
import { useEkuboSwap } from '@/hooks/useEkuboSwap';
import { getTokensForChain, type Token } from '@/config/tokens';
import { CHAIN_INFO } from '@/config/chains';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { getContractAddress } from '@/config/contracts';
import { toast } from 'sonner';
import StarknetWalletButton from './StarknetWalletButton';

const FEE_PERCENT = 0.01;

const SwapCard = () => {
  const [sellAmount, setSellAmount] = useState('');
  const [sellToken, setSellToken] = useState<Token | null>(null);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [chainId, setChainId] = useState<number | string>(1);
  const [modalOpen, setModalOpen] = useState<'sell' | 'buy' | null>(null);
  const [slippage, setSlippage] = useState(1);

  const { isConnected: isEvmConnected, address: evmAddress } = useAppKitAccount();
  const { chainId: walletChainId } = useAppKitNetwork();
  const { open } = useAppKit();

  // Starknet wallet (using Ekubo)
  const {
    status: starknetStatus,
    error: starknetError,
    txHash: starknetTxHash,
    executeSwap: executeEkuboSwap,
    reset: resetEkuboSwap,
    isConnected: isStarknetConnected,
    address: starknetAddress,
    connect: connectStarknet,
  } = useEkuboSwap();

  const isStarknet = chainId === 'starknet';
  const isConnected = isStarknet ? isStarknetConnected : isEvmConnected;
  const address = isStarknet ? starknetAddress : evmAddress;

  const chainInfo = CHAIN_INFO[chainId as keyof typeof CHAIN_INFO];

  const { 
    status: evmSwapStatus, 
    error: evmSwapError, 
    txHash: evmTxHash, 
    executeSwap: executeEvmSwap, 
    reset: resetEvmSwap 
  } = useSwapExecution();

  // Unified status/error/txHash based on chain
  const swapStatus = isStarknet ? starknetStatus : evmSwapStatus;
  const swapError = isStarknet ? starknetError : evmSwapError;
  const txHash = isStarknet ? starknetTxHash : evmTxHash;
  const resetSwap = isStarknet ? resetEkuboSwap : resetEvmSwap;

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
    resetSwap();
  }, [chainId, resetSwap]);

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
    resetSwap();
  };

  const handleSwap = async () => {
    if (!isConnected) {
      if (isStarknet) {
        try {
          await connectStarknet();
        } catch (e) {
          toast.error(e instanceof Error ? e.message : 'Failed to connect Starknet wallet');
        }
      } else {
        open();
      }
      return;
    }

    if (!sellToken || !buyToken || !sellAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.info('Starting swap...', { id: 'swap-progress' });

    if (isStarknet) {
      // Execute Starknet swap via Ekubo
      const result = await executeEkuboSwap(
        sellToken,
        buyToken,
        sellAmount,
        slippage
      );

      if (result.error) {
        toast.error(result.error, { id: 'swap-progress' });
      } else if (result.transactionHash) {
        toast.success(
          <div>
            <p>Swap successful! 🌱</p>
            <p className="text-xs opacity-70">Trees planted with 1% fee</p>
          </div>,
          { id: 'swap-progress' }
        );
        setSellAmount('');
      }
    } else {
      // Execute EVM swap
      const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId;
      
      const contractAddress = getContractAddress(numericChainId);
      if (!contractAddress) {
        toast.error('Smart contract not deployed on this chain yet. Demo mode active.');
        return;
      }

      const result = await executeEvmSwap(
        numericChainId,
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
            <p className="text-xs opacity-70">Trees planted with 1% fee</p>
          </div>,
          { id: 'swap-progress' }
        );
        setSellAmount('');
      }
    }
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
  const treesPlanted = (feeAmount * 0.40) / 2.5; // 40% of fee goes to trees at $2.50/tree

  const getButtonText = () => {
    if (!isConnected) {
      return isStarknet ? 'Connect Starknet Wallet' : 'Connect Wallet';
    }
    if (!sellToken || !buyToken) return 'Select Token';
    if (!sellAmount) return 'Enter Amount';
    
    switch (swapStatus) {
      case 'fetching-quote': return 'Getting quote...';
      case 'building-tx': return 'Building transaction...';
      case 'awaiting-signature': return 'Confirm in wallet...';
      case 'approving': return 'Approving token...';
      case 'swapping': 
      case 'confirming':
        return 'Swapping...';
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
    swapStatus === 'building-tx' ||
    swapStatus === 'awaiting-signature' ||
    swapStatus === 'approving' || 
    swapStatus === 'swapping' ||
    swapStatus === 'confirming'
  );

  const isContractDeployed = isStarknet ? true : getContractAddress(typeof chainId === 'string' ? parseInt(chainId) : chainId) !== null;

  // Get block explorer URL
  const getExplorerTxUrl = () => {
    if (!txHash) return '';
    if (isStarknet) {
      return `https://starkscan.co/tx/${txHash}`;
    }
    return `${chainInfo?.blockExplorer || 'https://etherscan.io'}/tx/${txHash}`;
  };

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

        {/* Demo mode indicator - only show for EVM chains without deployed contract */}
        {!isStarknet && !isContractDeployed && (
          <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              ⚠️ Demo mode: Contract not deployed on {chainInfo?.name}
            </p>
          </div>
        )}

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
                <div>
                  <span className="text-sm font-medium text-foreground">1% goes to reforestation</span>
                  {treesPlanted > 0 && (
                    <p className="text-[10px] text-muted-foreground">≈ {treesPlanted.toFixed(2)} trees planted</p>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold text-primary">${feeAmount.toFixed(2)}</span>
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
