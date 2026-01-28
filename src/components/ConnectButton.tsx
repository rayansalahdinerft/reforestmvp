import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ChevronDown } from 'lucide-react';

const ConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <button
        onClick={() => open({ view: 'Account' })}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span>{formatAddress(address)}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  return (
    <button 
      onClick={() => open()}
      className="connect-wallet-btn"
    >
      Connect wallet
    </button>
  );
};

export default ConnectButton;
