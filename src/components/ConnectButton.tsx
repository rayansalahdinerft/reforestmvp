import { useState } from 'react';
import { ChevronDown, Wallet, LogOut, X } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

const WALLET_LOGOS: Record<string, string> = {
  injected: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  'io.metamask': 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  coinbaseWalletSDK: 'https://altcoinsbox.com/wp-content/uploads/2022/12/coinbase-logo-300x300.webp',
  walletConnect: 'https://registry.walletconnect.com/v2/logo/md/09b31455-71e7-48e5-88b7-b3e2106b2900',
};

const ConnectButton = () => {
  const { address, isConnected, connectors, openConnect, disconnect, isPending } = useWallet();
  const [showModal, setShowModal] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async (connectorId: string) => {
    try {
      await openConnect(connectorId);
      setShowModal(false);
      toast.success('Wallet connected!');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Connection failed';
      if (!msg.includes('rejected')) {
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
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="connect-wallet-btn flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap"
      >
        <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
        <span>{isPending ? 'Connecting...' : 'Connect'}</span>
      </button>

      {/* Wallet Selection Modal - positioned top-right */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed z-50 top-16 right-3 sm:right-6 w-[340px] max-w-[calc(100vw-1.5rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3 className="text-base font-bold text-foreground">Connect Wallet</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Wallet options */}
            <div className="flex flex-col gap-1.5 px-4 pb-4">
              {connectors.map((connector) => {
                const logoUrl = WALLET_LOGOS[connector.id] || connector.icon;
                return (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector.id)}
                    disabled={isPending}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-secondary/60 hover:bg-secondary border border-border/40 hover:border-primary/40 transition-all text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt={connector.name} 
                          className="w-7 h-7 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Wallet className={`w-5 h-5 text-muted-foreground ${logoUrl ? 'hidden' : ''}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors block truncate">
                        {connector.name}
                      </span>
                      {connector.id === 'walletConnect' && (
                        <span className="text-xs text-muted-foreground">QR code & mobile</span>
                      )}
                      {connector.id === 'injected' && (
                        <span className="text-xs text-muted-foreground">Browser extension</span>
                      )}
                      {connector.id === 'coinbaseWalletSDK' && (
                        <span className="text-xs text-muted-foreground">Coinbase app & extension</span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 flex-shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-border/50 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Connect your wallet to start swapping 🌱
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ConnectButton;
