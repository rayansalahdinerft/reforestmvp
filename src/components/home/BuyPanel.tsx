import { X, ExternalLink } from 'lucide-react';

interface BuyPanelProps {
  onClose: () => void;
  address: string | null;
}

const BuyPanel = ({ onClose, address }: BuyPanelProps) => {
  const transakUrl = `https://global.transak.com/?apiKey=af3a8236-5c7e-4dcd-b25c-c15a0e2ef74e&cryptoCurrencyCode=ETH&walletAddress=${address ?? ''}&network=ethereum&hideMenu=true&themeColor=22c55e&disableWalletAddressForm=true`;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
        <h2 className="text-lg font-bold text-foreground">Buy Crypto</h2>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center">
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Transak iframe */}
      <div className="flex-1 px-2 pb-2">
        <iframe
          src={transakUrl}
          className="w-full h-full rounded-2xl border border-border"
          allow="camera;microphone;payment"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation allow-popups-to-escape-sandbox"
          title="Buy Crypto with Transak"
        />
      </div>
    </div>
  );
};

export default BuyPanel;
