import { useEffect, useRef } from 'react';

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
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load the Thirdweb Bridge Widget script
    if (!scriptLoadedRef.current) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/thirdweb/dist/scripts/bridge-widget.js';
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        renderWidget();
      };
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    function renderWidget() {
      if (containerRef.current && window.BridgeWidget) {
        // Clear previous widget
        containerRef.current.innerHTML = '';
        
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
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [clientId]);

  return (
    <div 
      ref={containerRef} 
      id="bridge-widget-container"
      className="w-full max-w-md mx-auto min-h-[500px]"
    />
  );
};

export default ThirdwebBridgeWidget;
