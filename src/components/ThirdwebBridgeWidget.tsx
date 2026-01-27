import { useEffect, useRef, useState } from 'react';
import { TreePine, Calculator } from 'lucide-react';

declare global {
  interface Window {
    BridgeWidget?: {
      render: (container: HTMLElement, config: Record<string, unknown>) => void;
    };
  }
}

interface ThirdwebBridgeWidgetProps {
  clientId: string;
}

// Fee configuration - 1% (100 basis points) to ReforestWallet
const FEE_CONFIG = {
  feeBps: 100,
  feeRecipient: '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669',
};

// Cost per tree in USD
const COST_PER_TREE_USD = 2.5;
const FEE_PERCENT = 0.01; // 1%
const REFOREST_PERCENT = 0.40; // 40% of fees

const ThirdwebBridgeWidget = ({ clientId }: ThirdwebBridgeWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRenderedRef = useRef(false);
  const [swapAmount, setSwapAmount] = useState<string>('');

  // Calculate impact
  const amountUSD = parseFloat(swapAmount) || 0;
  const feeAmount = amountUSD * FEE_PERCENT;
  const reforestAmount = feeAmount * REFOREST_PERCENT;
  const treesPlanted = reforestAmount / COST_PER_TREE_USD;

  useEffect(() => {
    let mounted = true;

    const loadAndRender = async () => {
      const existingScript = document.querySelector('script[src*="bridge-widget.js"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/thirdweb/dist/scripts/bridge-widget.js';
        script.async = true;
        
        await new Promise<void>((resolve) => {
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      if (mounted && containerRef.current && window.BridgeWidget && !widgetRenderedRef.current) {
        containerRef.current.innerHTML = '';
        widgetRenderedRef.current = true;
        
        window.BridgeWidget.render(containerRef.current, {
          clientId: clientId,
          theme: 'dark',
          fee: {
            bps: FEE_CONFIG.feeBps,
            recipient: FEE_CONFIG.feeRecipient,
          },
        });
      }
    };

    loadAndRender();

    return () => {
      mounted = false;
    };
  }, [clientId]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Impact Calculator */}
      <div className="mb-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Calculez votre impact</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                placeholder="Montant du swap"
                className="w-full px-3 py-2 pr-14 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                USD
              </span>
            </div>
          </div>
        </div>

        {amountUSD > 0 && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frais (1%)</span>
              <span className="text-foreground">${feeAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reversé à l'ONG (40%)</span>
              <span className="text-primary">${reforestAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-sm font-medium text-foreground flex items-center gap-2">
                <TreePine className="w-4 h-4 text-primary" />
                Arbres plantés
              </span>
              <span className="text-lg font-bold text-primary">
                {treesPlanted >= 1 
                  ? `${Math.floor(treesPlanted)} 🌱` 
                  : treesPlanted > 0 
                    ? `~${treesPlanted.toFixed(2)} 🌱`
                    : '0'
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thirdweb Widget */}
      <div 
        ref={containerRef} 
        id="bridge-widget-container"
        className="min-h-[500px]"
      />

      {/* Simple footer text */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        40% des frais reversés à notre ONG partenaire • 1 arbre = $2.50
      </p>
    </div>
  );
};

export default ThirdwebBridgeWidget;
