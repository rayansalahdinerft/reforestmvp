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
