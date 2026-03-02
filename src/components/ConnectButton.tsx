import { Wallet, LogOut } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const ConnectButton = () => {
  const { address, isConnected, openConnect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={openConnect}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border transition-all group"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-semibold text-sm">{formatAddress(address)}</span>
        </button>
        <button
          onClick={disconnect}
          className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={openConnect}
      className="connect-wallet-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap"
    >
      <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      <span>Connect</span>
    </button>
  );
};

export default ConnectButton;
