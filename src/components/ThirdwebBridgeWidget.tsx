import { useEffect, useRef, useState } from 'react';
import { TreePine } from 'lucide-react';

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

const ThirdwebBridgeWidget = ({ clientId }: ThirdwebBridgeWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRenderedRef = useRef(false);
  const [estimatedTrees, setEstimatedTrees] = useState<number>(0);

  // Calculate trees based on swap amount (observed from widget inputs)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Try to find input values in the widget
      const inputs = containerRef.current?.querySelectorAll('input');
      inputs?.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
          // Estimate USD value (simplified - assumes rough token prices)
          const estimatedUSD = value * 100; // Placeholder estimation
          const feeAmount = estimatedUSD * 0.01; // 1% fee
          const reforestAmount = feeAmount * 0.40; // 40% to reforestation
          const trees = reforestAmount / COST_PER_TREE_USD;
          if (trees !== estimatedTrees) {
            setEstimatedTrees(Math.max(0, trees));
          }
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { subtree: true, childList: true, characterData: true });
    }

    return () => observer.disconnect();
  }, [estimatedTrees]);

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
      {/* Thirdweb Widget */}
      <div 
        ref={containerRef} 
        id="bridge-widget-container"
        className="min-h-[500px]"
      />

      {/* Simple footer text */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <TreePine className="w-4 h-4 text-primary" />
        <span>
          40% des frais reversés à notre ONG partenaire
          {estimatedTrees > 0.01 && (
            <span className="text-primary font-medium">
              {' '}• ~{estimatedTrees.toFixed(2)} arbres 🌱
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default ThirdwebBridgeWidget;
