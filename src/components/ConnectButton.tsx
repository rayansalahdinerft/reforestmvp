import { useState } from 'react';
import { ChevronDown, Wallet, LogOut, X } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

const WALLET_ICONS: Record<string, string> = {
  injected: '🦊',
  'io.metamask': '🦊',
  coinbaseWalletSDK: '🔵',
  walletConnect: '🔗',
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

      {/* Wallet Selection Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Connect Wallet</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isPending}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl bg-secondary hover:bg-secondary/70 border border-border/50 hover:border-primary/30 transition-all text-left group"
                >
                  <span className="text-2xl">{WALLET_ICONS[connector.id] || '💎'}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {connector.name}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Connect your wallet to start swapping
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default ConnectButton;
