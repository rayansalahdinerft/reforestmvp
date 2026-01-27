import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { Wallet, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';

const ConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <Button
        variant="connect"
        onClick={() => open({ view: 'Account' })}
        className="gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>{formatAddress(address)}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button variant="connect" onClick={() => open()}>
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </Button>
  );
};

export default ConnectButton;
