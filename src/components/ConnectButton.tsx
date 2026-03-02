import { useState } from 'react';
import { ChevronDown, Wallet, LogOut, X } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

// Official wallet logos
const WALLET_CONFIG: Record<string, { name: string; logo: string; desc: string }> = {
  injected: {
    name: 'MetaMask',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    desc: 'Browser extension',
  },
  'io.metamask': {
    name: 'MetaMask',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    desc: 'Browser extension',
  },
  coinbaseWalletSDK: {
    name: 'Coinbase Wallet',
    logo: 'https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo-300x300.webp',
    desc: 'Coinbase app & extension',
  },
  walletConnect: {
    name: 'WalletConnect',
    logo: 'https://registry.walletconnect.com/v2/logo/md/09b31455-71e7-48e5-88b7-b3e2106b2900',
    desc: 'Scan QR with mobile wallet',
  },
};

const ConnectButton = () => {
  const { address, isConnected, connectors, openConnect, disconnect, isPending } = useWallet();
  const [showModal, setShowModal] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async (connectorId: string) => {
    try {
      setShowModal(false);
      await openConnect(connectorId);
      toast.success('Wallet connected!');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Connection failed';
      if (!msg.includes('rejected') && !msg.includes('User rejected')) {
        toast.error(msg);
      }
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <button
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
    <div className="relative">
      <button 
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="connect-wallet-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap"
      >
        <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        <span>{isPending ? 'Connecting...' : 'Connect'}</span>
      </button>

      {/* Wallet Selection Dropdown - anchored below the Connect button */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowModal(false)} />
          <div className="absolute z-50 top-full right-0 mt-2 w-[300px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-sm font-bold text-foreground">Connect Wallet</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Wallet options */}
            <div className="flex flex-col gap-1 px-3 pb-3">
              {connectors.map((connector) => {
                const cfg = WALLET_CONFIG[connector.id];
                const displayName = cfg?.name || connector.name;
                const logo = cfg?.logo || connector.icon;
                const desc = cfg?.desc || '';
                
                return (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector.id)}
                    disabled={isPending}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/30 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted/80 flex items-center justify-center flex-shrink-0">
                      {logo ? (
                        <img 
                          src={logo} 
                          alt={displayName} 
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            const el = e.target as HTMLImageElement;
                            el.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors block">
                        {displayName}
                      </span>
                      {desc && <span className="text-[11px] text-muted-foreground leading-tight">{desc}</span>}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90 flex-shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20">
              <p className="text-[11px] text-muted-foreground text-center">
                Connect your wallet to start swapping 🌱
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectButton;
