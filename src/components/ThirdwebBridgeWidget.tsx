import { useEffect, useRef } from 'react';
import { TreePine, Leaf, Heart } from 'lucide-react';

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
  // Fee in basis points (100 = 1%)
  feeBps: 100,
  // EVM fee recipient address
  feeRecipient: '0x127677CbD1A56168CD47C5A22B584Bc9Fe8d7669',
};

const ThirdwebBridgeWidget = ({ clientId }: ThirdwebBridgeWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRenderedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const loadAndRender = async () => {
      // Check if script already exists
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

      // Wait a bit for the script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      if (mounted && containerRef.current && window.BridgeWidget && !widgetRenderedRef.current) {
        containerRef.current.innerHTML = '';
        widgetRenderedRef.current = true;
        
        window.BridgeWidget.render(containerRef.current, {
          clientId: clientId,
          theme: 'dark',
          // Fee configuration for ReforestWallet (1% fee)
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
      {/* Fee Info Banner - Above Widget */}
      <div className="mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <TreePine className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Pour la planète 🌍
            </p>
            <p className="text-xs text-muted-foreground">
              40% des frais financent la reforestation
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20">
            <Leaf className="w-3 h-3 text-primary" />
            <span className="text-xs font-bold text-primary">40%</span>
          </div>
        </div>
      </div>

      {/* Thirdweb Widget */}
      <div 
        ref={containerRef} 
        id="bridge-widget-container"
        className="min-h-[500px]"
      />

      {/* Impact Info - Below Widget */}
      <div className="mt-4 p-3 rounded-xl bg-secondary/50 border border-border/50">
        <div className="flex items-start gap-3">
          <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">
              <span className="text-foreground font-medium">Comment ça marche ?</span>
            </p>
            <p>
              40% des frais de ReforestWallet sont automatiquement reversés à des projets de reforestation. 
              Swappez en toute tranquillité, on s'occupe de la planète. 🌱
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdwebBridgeWidget;
