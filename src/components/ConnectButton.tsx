import { useState } from 'react';
import { Wallet, LogOut, Copy, Check, ChevronDown } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const ConnectButton = () => {
  const { address, isConnected, openConnect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Address copied!');
    }
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border transition-all">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-semibold text-sm text-foreground">{formatAddress(address)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="w-4 h-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
