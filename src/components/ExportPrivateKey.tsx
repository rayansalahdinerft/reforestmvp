import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Key, Eye, EyeOff, Copy, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const ExportPrivateKey = () => {
  const { wallets } = useWallet();
  const [revealed, setRevealed] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleReveal = async () => {
    if (!confirmed) return;
    setLoading(true);
    try {
      // Dynamic SDK embedded wallets expose exportPrivateKey
      const embeddedWallets = wallets?.filter((w: any) => w.connector?.isEmbeddedWallet) ?? [];
      const wallet = embeddedWallets[0] as any;
      
      if (wallet?.connector?.exportPrivateKey) {
        const key = await wallet.connector.exportPrivateKey();
        setPrivateKey(key);
        setRevealed(true);
      } else if (wallet?.key) {
        setPrivateKey(wallet.key);
        setRevealed(true);
      } else {
        toast.error('Private key export is not available for this wallet type');
      }
    } catch (err: any) {
      console.error('Export error:', err);
      toast.error('Failed to export private key');
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!privateKey) return;
    await navigator.clipboard.writeText(privateKey);
    setCopied(true);
    toast.success('Private key copied');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
          <Key className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Export Private Key</h3>
          <p className="text-xs text-muted-foreground">Access your Ethereum private key</p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-xs text-destructive/90">
            <strong>Warning:</strong> Never share your private key. Anyone with access can steal your funds. Store it securely offline.
          </p>
        </div>
      </div>

      {!revealed ? (
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-xs text-muted-foreground">
              I understand the risks and will store my key securely
            </span>
          </label>
          <button
            onClick={handleReveal}
            disabled={!confirmed || loading}
            className="w-full py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive font-medium text-sm flex items-center justify-center gap-2 hover:bg-destructive/20 transition-all disabled:opacity-40"
          >
            <Eye className="w-4 h-4" />
            {loading ? 'Exporting...' : 'Reveal Private Key'}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative p-3 rounded-xl bg-card border border-border">
            <p className="text-xs font-mono text-foreground break-all pr-8">
              {privateKey}
            </p>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={() => { setRevealed(false); setPrivateKey(null); setConfirmed(false); }}
            className="w-full py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium flex items-center justify-center gap-2"
          >
            <EyeOff className="w-4 h-4" />
            Hide Private Key
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportPrivateKey;
