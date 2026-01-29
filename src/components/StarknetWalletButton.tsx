import { useState } from 'react';
import { useStarknetWallet } from '@/hooks/useStarknetWallet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, ChevronDown, LogOut, Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';

const StarknetWalletButton = () => {
  const { 
    address, 
    isConnected, 
    isConnecting, 
    walletType,
    availableWallets, 
    connect, 
    disconnect 
  } = useStarknetWallet();
  
  const [copied, setCopied] = useState(false);

  const handleConnect = async (walletId?: string) => {
    try {
      await connect(walletId);
      toast.success('Wallet connected!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect';
      toast.error(message);
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Address copied!');
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{formatAddress(address)}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyAddress} className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a 
              href={`https://starkscan.co/contract/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect} className="gap-2 text-destructive">
            <LogOut className="w-4 h-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (availableWallets.length === 0) {
    return (
      <Button 
        variant="outline"
        onClick={() => window.open('https://www.argent.xyz/argent-x/', '_blank')}
      >
        Install Starknet Wallet
      </Button>
    );
  }

  if (availableWallets.length === 1) {
    return (
      <Button 
        onClick={() => handleConnect(availableWallets[0].id)}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Connecting...
          </>
        ) : (
          `Connect ${availableWallets[0].name}`
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            'Connect Starknet Wallet'
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableWallets.map((wallet) => (
          <DropdownMenuItem 
            key={wallet.id}
            onClick={() => handleConnect(wallet.id)}
            className="gap-2"
          >
            <img src={wallet.icon} alt={wallet.name} className="w-5 h-5" />
            {wallet.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StarknetWalletButton;
