import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useOnboarding } from '@/hooks/useOnboarding';
import { toast } from 'sonner';

const ConnectButton = () => {
  const { address, isConnected, openConnect, disconnect } = useWallet();
  const { onboardingCompleted } = useOnboarding();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Address copied!');
    }
  };

  const handleConnect = () => {
    // If not onboarded, go to onboarding flow first
    if (onboardingCompleted === false || onboardingCompleted === null) {
      navigate('/onboarding');
      return;
    }

    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
      toast.info('Connexion ouverte dans un nouvel onglet');
      return;
    }

    openConnect();
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyAddress}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-secondary hover:bg-secondary/80 border border-border transition-all group"
          title="Copy address"
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-semibold text-sm text-foreground">{formatAddress(address)}</span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </button>
        <button
          onClick={disconnect}
          className="p-2.5 rounded-xl bg-secondary hover:bg-destructive/20 border border-border hover:border-destructive/30 transition-all text-muted-foreground hover:text-destructive"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      className="connect-wallet-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap"
    >
      <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
      <span>Connect</span>
    </button>
  );
};

export default ConnectButton;
