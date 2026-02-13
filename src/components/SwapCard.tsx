import { useState, useEffect, useRef } from 'react';
import { ArrowDown, ChevronDown, Sparkles, TrendingUp, Loader2, CheckCircle, AlertCircle, SlidersHorizontal, X, CreditCard, ArrowLeftRight } from 'lucide-react';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { useBalance } from 'wagmi';
import TokenSelectorModal from './TokenSelectorModal';
import { useSwapQuote } from '@/hooks/useSwapQuote';
import { useSwapExecution } from '@/hooks/useSwapExecution';
import { getTokensForChain, type Token } from '@/config/tokens';
import { CHAIN_INFO } from '@/config/chains';
import { useTokenPrices } from '@/hooks/useTokenPrices';
import { getContractAddress } from '@/config/contracts';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const FEE_PERCENT = 0.01;
const REFORESTATION_PERCENT = 0.40; // 40% of fee goes to NGO (swap mode)
const BUY_REFORESTATION_PERCENT = 0.002; // 0.2% of amount goes to NGO (buy mode)
const CHAIN_ID = 1; // Ethereum mainnet only

const SwapCard = () => {
  const [mode, setMode] = useState<'swap' | 'buy'>('swap');
  const [sellAmount, setSellAmount] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [buyFiatAmount, setBuyFiatAmount] = useState('');
  const [activeInput, setActiveInput] = useState<'sell' | 'buy'>('sell');
  const [sellToken, setSellToken] = useState<Token | null>(null);
  const [buyToken, setBuyToken] = useState<Token | null>(null);
  const [modalOpen, setModalOpen] = useState<'sell' | 'buy' | null>(null);
  const [slippage, setSlippage] = useState(1);
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);
  const [inputMode, setInputMode] = useState<'token' | 'usd'>('token');
  const slippageRef = useRef<HTMLDivElement>(null);

  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();

  const chainInfo = CHAIN_INFO[CHAIN_ID];

  // Get native ETH balance for MAX button
  const { data: nativeBalance } = useBalance({
    address: address as `0x${string}` | undefined,
  });
  
  // Calculate formatted balance for MAX button (only ETH for now)
  const isNativeToken = sellToken?.address?.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  const maxBalance = isNativeToken && nativeBalance 
    ? (Number(nativeBalance.value) / Math.pow(10, nativeBalance.decimals)).toFixed(6)
    : null;

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

  // Close slippage panel on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (slippageRef.current && !slippageRef.current.contains(event.target as Node)) {
        setShowSlippageSettings(false);
      }
    };

    if (showSlippageSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSlippageSettings]);

  // Get live prices FIRST (needed for USD mode calculations)
  const { getPrice } = useTokenPrices(
    [sellToken?.symbol, buyToken?.symbol].filter(Boolean) as string[]
  );
  
  const sellPrice = sellToken ? getPrice(sellToken.symbol) : null;
  const buyPrice = buyToken ? getPrice(buyToken.symbol) : null;

  // Quote for sell -> buy direction
  // When in USD mode, convert USD to token amount first
  const sellTokenAmount = inputMode === 'usd' && sellPrice && sellAmount
    ? (parseFloat(sellAmount) / sellPrice).toString()
    : sellAmount;

  const { quote: sellQuote, loading: sellQuoteLoading } = useSwapQuote(
    sellToken,
    buyToken,
    activeInput === 'sell' ? sellTokenAmount : '',
    CHAIN_ID
  );

  // Quote for buy -> sell direction (reverse)
  const buyTokenAmount = inputMode === 'usd' && buyPrice && buyAmount
    ? (parseFloat(buyAmount) / buyPrice).toString()
    : buyAmount;

  const { quote: buyQuote, loading: buyQuoteLoading } = useSwapQuote(
    buyToken,
    sellToken,
    activeInput === 'buy' ? buyTokenAmount : '',
    CHAIN_ID
  );

  const quoteLoading = sellQuoteLoading || buyQuoteLoading;

  // Update the opposite field when quote is received
  useEffect(() => {
    if (activeInput === 'sell' && sellQuote?.toAmount) {
      if (inputMode === 'usd' && buyPrice) {
        // Convert token amount to USD
        setBuyAmount((parseFloat(sellQuote.toAmount) * buyPrice).toFixed(2));
      } else {
        setBuyAmount(parseFloat(sellQuote.toAmount).toFixed(6));
      }
    }
  }, [sellQuote?.toAmount, activeInput, inputMode, buyPrice]);

  useEffect(() => {
    if (activeInput === 'buy' && buyQuote?.toAmount) {
      if (inputMode === 'usd' && sellPrice) {
        // Convert token amount to USD
        setSellAmount((parseFloat(buyQuote.toAmount) * sellPrice).toFixed(2));
      } else {
        setSellAmount(parseFloat(buyQuote.toAmount).toFixed(6));
      }
    }
  }, [buyQuote?.toAmount, activeInput, inputMode, sellPrice]);

  const handleSwapTokens = () => {
    const tempToken = sellToken;
    const tempAmount = sellAmount;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
    setActiveInput(activeInput === 'sell' ? 'buy' : 'sell');
    resetSwap();
  };

  const handleSwap = async () => {
    if (!isConnected) {
      open();
      return;
    }

    // In USD mode, convert to token amount for the actual swap
    const actualSellAmount = inputMode === 'usd' && sellPrice && sellAmount
      ? (parseFloat(sellAmount) / sellPrice).toString()
      : sellAmount;

    if (!sellToken || !buyToken || !actualSellAmount) {
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
      actualSellAmount,
      slippage
    );

    if (result.error) {
      toast.error(result.error, { id: 'swap-progress' });
    } else if (result.hash) {
      // Calculate the donation amount (40% of 1% fee = 0.4% of transaction)
      // Use the original sellAmount in USD mode, or calculate USD value from token amount
      const getPriceFallback = (symbol?: string): number => {
        if (!symbol) return 0;
        const fallbacks: Record<string, number> = {
          'ETH': 2700, 'WETH': 2700, 'USDC': 1, 'USDT': 1, 'DAI': 1,
          'WBTC': 95000, 'LINK': 20, 'UNI': 10, 'AAVE': 200, 'MKR': 2000,
        };
        return fallbacks[symbol.toUpperCase()] || 1;
      };
      
      // In USD mode, sellAmount is already in USD. In token mode, convert to USD.
      const swapUsdValue = inputMode === 'usd' 
        ? parseFloat(sellAmount || '0')
        : parseFloat(actualSellAmount) * (sellPrice || getPriceFallback(sellToken?.symbol));
      
      const totalFee = swapUsdValue * FEE_PERCENT; // 1% of transaction
      const donationAmount = totalFee * REFORESTATION_PERCENT; // 40% of fee = 0.4% of transaction

      console.log('[REFOREST] Swap success - calculating donation:', {
        inputMode,
        sellAmount,
        actualSellAmount,
        sellTokenSymbol: sellToken?.symbol,
        sellPrice,
        swapUsdValue,
        totalFee,
        donationAmount,
        address,
        txHash: result.hash
      });

      // ALWAYS try to update tree counter after successful swap
      console.log('[REFOREST] Attempting to update tree counter...');
      
      try {
        if (!address) {
          console.error('[REFOREST] Missing wallet address after swap success; skipping impact update.');
        } else {
          const payload = {
            donationUsd: donationAmount > 0 ? donationAmount : 0.01, // Minimum $0.01
            txHash: result.hash,
            walletAddress: address,
          };

          console.log('[REFOREST] Calling update-tree-counter with:', payload);

          const { data: updateData, error: updateError } = await supabase.functions.invoke('update-tree-counter', {
            body: payload,
          });

          if (updateError) {
            console.error('[REFOREST] Failed to update tree counter:', updateError);
          } else {
            console.log('[REFOREST] Tree counter updated successfully:', updateData);
          }
        }
      } catch (err) {
        console.error('[REFOREST] Error calling update-tree-counter:', err);
      }

      toast.success(
        <div>
          <p>Swap successful! 🌱</p>
          <p className="text-xs opacity-70">+${donationAmount.toFixed(2)} donated to reforestation</p>
        </div>,
        { id: 'swap-progress' }
      );
      setSellAmount('');
      setBuyAmount('');
    }
  };

  // Calculate USD/Token display values
  const sellDisplayValue = inputMode === 'usd' 
    ? sellAmount 
    : (sellAmount && sellPrice ? (parseFloat(sellAmount) * sellPrice).toFixed(2) : null);
  
  const sellTokenDisplay = inputMode === 'usd' && sellPrice && sellAmount
    ? (parseFloat(sellAmount) / sellPrice).toFixed(6)
    : sellAmount;

  const buyDisplayValue = inputMode === 'usd'
    ? buyAmount
    : (buyAmount && buyPrice ? (parseFloat(buyAmount) * buyPrice).toFixed(2) : null);

  const buyTokenDisplay = inputMode === 'usd' && buyPrice && buyAmount
    ? (parseFloat(buyAmount) / buyPrice).toFixed(6)
    : buyAmount;

  // Fee calculation (always in USD)
  const sellUsdValue = inputMode === 'usd' 
    ? sellAmount 
    : (sellAmount && sellPrice ? (parseFloat(sellAmount) * sellPrice).toFixed(2) : null);
  
  const feeAmount = sellUsdValue ? parseFloat(sellUsdValue) * FEE_PERCENT : 0;
  const reforestationAmount = mode === 'buy'
    ? (buyFiatAmount ? parseFloat(buyFiatAmount) * BUY_REFORESTATION_PERCENT : 0)
    : feeAmount * 0.40; // 40% of fee goes to NGO
  const treesPlanted = reforestationAmount / 2.5; // $2.50 per tree

  // Buy mode: estimated crypto amount
  const buyModeCryptoEstimate = buyFiatAmount && buyToken && buyPrice
    ? (parseFloat(buyFiatAmount) / buyPrice).toFixed(6)
    : null;

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
    <div className="w-full max-w-[460px] mx-auto animate-slide-up px-1 sm:px-0">
      {/* Card */}
      <div className="swap-card p-0.5 sm:p-1.5">
        {/* Header */}
        <div ref={slippageRef}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-5 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              {/* Swap / Buy Toggle */}
              <div className="flex items-center bg-secondary/80 rounded-xl p-0.5">
                <button
                  onClick={() => { setMode('swap'); setBuyFiatAmount(''); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    mode === 'swap'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Swap
                </button>
                <button
                  onClick={() => { setMode('buy'); setSellAmount(''); setBuyAmount(''); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    mode === 'buy'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Buy
                </button>
              </div>
              {mode === 'swap' && (
                <>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">on</span>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-secondary/80 font-semibold text-xs sm:text-sm">
                    {chainInfo?.logoURI && (
                      <img src={chainInfo.logoURI} alt={chainInfo.name} className="w-4 h-4 sm:w-5 sm:h-5 rounded-full" />
                    )}
                    <span>{chainInfo?.name}</span>
                  </div>
                </>
              )}
            </div>
            
            {mode === 'swap' && (
              <div className="relative self-end sm:self-auto">
                <button
                  onClick={() => setShowSlippageSettings(!showSlippageSettings)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all text-xs sm:text-sm ${
                    showSlippageSettings 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-medium">{slippage}%</span>
                </button>
              </div>
            )}
          </div>

          {/* Slippage Settings Panel */}
          {showSlippageSettings && (
            <div className="mx-3 sm:mx-4 mb-3 px-3 sm:px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-medium text-foreground">Slippage Tolerance</span>
                <button
                  onClick={() => setShowSlippageSettings(false)}
                  className="p-1 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {[0.5, 1, 2, 3].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                      slippage === value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
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
                    className="w-full px-1.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-center bg-secondary rounded-lg border-none outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0.1"
                    max="50"
                    step="0.1"
                    placeholder="Custom"
                  />
                  <span className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-sm text-muted-foreground pointer-events-none">%</span>
                </div>
              </div>
              {slippage > 5 && (
                <p className="mt-2 text-[10px] sm:text-xs text-yellow-500">⚠️ High slippage may result in unfavorable trades</p>
              )}
            </div>
          )}
        </div>

        {mode === 'swap' ? (
          <>
            {/* Demo mode indicator */}
            {!isContractDeployed && (
              <div className="mx-3 sm:mx-4 mb-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  ⚠️ Demo mode: Contract not deployed
                </p>
              </div>
            )}

            {/* Sell Section */}
            <div className="px-3 sm:px-4 pb-2">
              <div className="token-input-row">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">You Pay</span>
                    <button
                      onClick={() => {
                        setInputMode(inputMode === 'token' ? 'usd' : 'token');
                        setSellAmount('');
                        setBuyAmount('');
                      }}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-lg transition-all ${
                        inputMode === 'usd' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {inputMode === 'usd' ? '$USD' : 'Token'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {maxBalance && isConnected && (
                      <>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          {(() => {
                            const bal = parseFloat(maxBalance);
                            const formattedBal = bal < 0.01 ? bal.toFixed(6) : bal.toFixed(4);
                            const usdValue = sellPrice ? (bal * sellPrice).toFixed(2) : null;
                            return `Bal: ${formattedBal} ${sellToken?.symbol}${usdValue ? ` ($${usdValue})` : ''}`;
                          })()}
                        </span>
                        <button
                          onClick={() => {
                            if (inputMode === 'usd' && sellPrice && maxBalance) {
                              setSellAmount((parseFloat(maxBalance) * sellPrice).toFixed(2));
                            } else {
                              setSellAmount(maxBalance);
                            }
                            setActiveInput('sell');
                            if (swapStatus === 'error' || swapStatus === 'success') {
                              resetSwap();
                            }
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all"
                        >
                          MAX
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {sellAmount && (
                  <div className="mb-2">
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                      {inputMode === 'usd' 
                        ? `≈ ${sellTokenDisplay} ${sellToken?.symbol || ''}`
                        : sellDisplayValue ? `$${sellDisplayValue}` : ''
                      }
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {quoteLoading && activeInput !== 'sell' ? (
                    <div className="h-8 sm:h-10 w-32 sm:w-40 bg-muted animate-shimmer rounded-xl" />
                  ) : (
                    <div className="flex items-center flex-1 gap-1">
                      {inputMode === 'usd' && <span className="text-2xl sm:text-3xl text-muted-foreground">$</span>}
                      <input
                        type="text"
                        inputMode="decimal"
                        value={sellAmount}
                        onChange={(e) => {
                          setSellAmount(e.target.value);
                          setActiveInput('sell');
                          if (swapStatus === 'error' || swapStatus === 'success') {
                            resetSwap();
                          }
                        }}
                        onFocus={() => setActiveInput('sell')}
                        placeholder="0.00"
                        className="swap-input flex-1 text-2xl sm:text-3xl"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => setModalOpen('sell')}
                    className="token-selector-btn shrink-0"
                  >
                    {sellToken?.logoURI && (
                      <img src={sellToken.logoURI} alt={sellToken.symbol} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-2 ring-border" />
                    )}
                    <span className="text-sm sm:text-base">{sellToken?.symbol || 'Select'}</span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleSwapTokens}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-card border-4 border-background flex items-center justify-center hover:bg-secondary transition-all duration-300 hover:rotate-180 group shadow-lg"
              >
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>

            {/* Buy Section */}
            <div className="px-3 sm:px-4 pt-2 pb-4">
              <div className="token-input-row bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">You Receive</span>
                  {buyAmount && (
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-[10px] sm:text-xs font-medium text-primary">
                        {inputMode === 'usd' 
                          ? `≈ ${buyTokenDisplay} ${buyToken?.symbol || ''}`
                          : buyDisplayValue ? `$${buyDisplayValue}` : ''
                        }
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {quoteLoading && activeInput !== 'buy' ? (
                    <div className="h-8 sm:h-10 w-32 sm:w-40 bg-muted animate-shimmer rounded-xl" />
                  ) : (
                    <div className="flex items-center flex-1 gap-1">
                      {inputMode === 'usd' && <span className="text-2xl sm:text-3xl text-primary/50">$</span>}
                      <input
                        type="text"
                        inputMode="decimal"
                        value={buyAmount}
                        onChange={(e) => {
                          setBuyAmount(e.target.value);
                          setActiveInput('buy');
                          if (swapStatus === 'error' || swapStatus === 'success') {
                            resetSwap();
                          }
                        }}
                        onFocus={() => setActiveInput('buy')}
                        placeholder="0.00"
                        className="swap-input flex-1 text-2xl sm:text-3xl text-primary"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => setModalOpen('buy')}
                    className="token-selector-btn shrink-0"
                  >
                    {buyToken ? (
                      <>
                        {buyToken.logoURI && (
                          <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-2 ring-border" />
                        )}
                        <span className="text-sm sm:text-base">{buyToken.symbol}</span>
                      </>
                    ) : (
                      <span className="text-primary font-bold text-sm sm:text-base">Select +</span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Fee Info */}
            {sellAmount && parseFloat(sellAmount) > 0 && (
              <div className="px-3 sm:px-5 pb-4">
                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs">🌱</span>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">Your fee saves the planet</span>
                      {treesPlanted > 0 && (
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground">≈ {treesPlanted.toFixed(2)} trees funded</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary">${reforestationAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {swapError && (
              <div className="px-3 sm:px-5 pb-4">
                <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-destructive/10 border border-destructive/20">
                  <p className="text-[10px] sm:text-xs text-destructive">{swapError}</p>
                </div>
              </div>
            )}

            {/* Transaction Hash */}
            {txHash && (
              <div className="px-3 sm:px-5 pb-4">
                <a 
                  href={getExplorerTxUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
                >
                  <p className="text-[10px] sm:text-xs text-primary truncate">View transaction: {txHash.slice(0, 8)}...{txHash.slice(-6)}</p>
                </a>
              </div>
            )}

            {/* Swap Button */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <button
                onClick={handleSwap}
                disabled={isButtonDisabled}
                className="w-full premium-button flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4"
              >
                {getButtonIcon()}
                {getButtonText()}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ===== BUY MODE ===== */}
            {/* Fiat Amount Input */}
            <div className="px-3 sm:px-4 pb-2">
              <div className="token-input-row">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">You Pay</span>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Credit / Debit Card</span>
                </div>
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center flex-1 gap-1">
                    <span className="text-2xl sm:text-3xl text-muted-foreground">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={buyFiatAmount}
                      onChange={(e) => setBuyFiatAmount(e.target.value)}
                      placeholder="0.00"
                      className="swap-input flex-1 text-2xl sm:text-3xl"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/80 font-semibold text-sm">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span>USD</span>
                  </div>
                </div>
                {/* Quick amount buttons */}
                <div className="flex gap-2 mt-3">
                  {[50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBuyFiatAmount(amount.toString())}
                      className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        buyFiatAmount === amount.toString()
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center -my-2 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-card border-4 border-background flex items-center justify-center shadow-lg">
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
            </div>

            {/* Crypto You Receive */}
            <div className="px-3 sm:px-4 pt-2 pb-4">
              <div className="token-input-row bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">You Receive</span>
                  {buyModeCryptoEstimate && buyToken && (
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-[10px] sm:text-xs font-medium text-primary">
                        ≈ {buyModeCryptoEstimate} {buyToken.symbol}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <div className="flex items-center flex-1 gap-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={buyModeCryptoEstimate || ''}
                      readOnly
                      placeholder="0.00"
                      className="swap-input flex-1 text-2xl sm:text-3xl text-primary cursor-default"
                    />
                  </div>
                  <button
                    onClick={() => setModalOpen('buy')}
                    className="token-selector-btn shrink-0"
                  >
                    {buyToken ? (
                      <>
                        {buyToken.logoURI && (
                          <img src={buyToken.logoURI} alt={buyToken.symbol} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full ring-2 ring-border" />
                        )}
                        <span className="text-sm sm:text-base">{buyToken.symbol}</span>
                      </>
                    ) : (
                      <span className="text-primary font-bold text-sm sm:text-base">Select +</span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Buy Fee Info - 0.2% donation */}
            {buyFiatAmount && parseFloat(buyFiatAmount) > 0 && (
              <div className="px-3 sm:px-5 pb-4">
                <div className="flex items-center justify-between py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs">🌱</span>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium text-foreground">0.2% donated to reforestation</span>
                      {treesPlanted > 0 && (
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground">≈ {treesPlanted.toFixed(2)} trees funded</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-primary">${reforestationAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Buy Button */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4">
              <button
                onClick={() => {
                  if (!buyFiatAmount || !buyToken) {
                    toast.error('Please enter an amount and select a token');
                    return;
                  }
                  toast.info('Fiat on-ramp coming soon! 🚧', {
                    description: 'Credit card purchases will be available shortly.',
                  });
                }}
                disabled={!buyFiatAmount || !buyToken || parseFloat(buyFiatAmount) <= 0}
                className="w-full premium-button flex items-center justify-center gap-2 text-sm sm:text-base py-3 sm:py-4"
              >
                <CreditCard className="w-5 h-5" />
                Buy & Plant Trees 🌱
              </button>
            </div>
          </>
        )}
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
