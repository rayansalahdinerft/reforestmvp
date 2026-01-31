import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { ChevronDown, Wallet } from 'lucide-react';

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
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border transition-all group"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
        <span className="font-semibold text-sm">{formatAddress(address)}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>
    );
  }

  return (
    <button 
      onClick={() => open()}
      className="connect-wallet-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap"
    >
      <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      <span>Connect</span>
    </button>
  );
};

export default ConnectButton;
