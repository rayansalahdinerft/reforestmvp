import { useWallet } from '@/hooks/useWallet';
import { Loader2 } from 'lucide-react';

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated, openConnect } = useWallet();

  if (!ready) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
        <img src="/icon.png" alt="ReforestWallet" className="w-16 h-16 rounded-2xl" />
        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
        <p className="text-sm text-foreground">Initialisation de la connexion…</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium"
        >
          Rafraîchir
        </button>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center gap-6 px-6">
        <div className="flex flex-col items-center gap-3">
          <img src="/icon.png" alt="ReforestWallet" className="w-20 h-20 rounded-2xl" />
          <h1 className="text-2xl font-bold text-foreground">ReforestWallet</h1>
          <p className="text-sm text-muted-foreground text-center max-w-[280px]">
            Swap crypto. Plant trees. Make an impact.
          </p>
        </div>
        <button
          onClick={openConnect}
          className="w-full max-w-[320px] py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base active:scale-[0.97] transition-transform"
        >
          Get Started
        </button>
        <p className="text-xs text-muted-foreground/60 text-center">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGate;
