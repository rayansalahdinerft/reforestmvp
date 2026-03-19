import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import NftGallery from "@/components/impact/NftGallery";
import SwapHistory from "@/components/SwapHistory";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useWalletStats } from "@/hooks/useWalletStats";
import { useWallet } from "@/hooks/useWallet";
import { useActiveWallet } from "@/contexts/ActiveWalletContext";
import { Wallet, RefreshCw, Settings } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { resolveAvatarUrl } from "@/utils/avatarResolver";
import { useNavigate } from "react-router-dom";
import mascot from '@/assets/mascot/panda-green-3d.png';

const Portfolio = () => {
  const { activeAddress } = useActiveWallet();
  const { balances, totalValue, loading, isConnected, refetch, priceError } = useWalletBalance(activeAddress);
  const { stats } = useWalletStats();
  const { openConnect } = useWallet();
  const { profile } = useOnboarding();
  const navigate = useNavigate();
  const treesPlanted = stats.totalTrees;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
        <div className="text-center mb-6 sm:mb-12 animate-fade-in relative">
          {/* Settings button */}
          <button
            onClick={() => navigate('/settings')}
            className="absolute right-0 top-0 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-all"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Profile display */}
          {isConnected && profile && (
            <div className="flex items-center justify-center gap-3 mb-4">
              {profile.avatar_url && (
                <img
                  src={resolveAvatarUrl(profile.avatar_url, '')}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                />
              )}
              <span className="text-lg font-bold text-foreground">{profile.pseudo}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-4 tracking-tight">
            Your <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground">Your tokens at a glance</p>
        </div>

        {!isConnected ? (
          <div className="swap-card p-5 sm:p-8 text-center animate-slide-up cursor-pointer hover:border-primary/30 transition-all" onClick={() => openConnect()}>
            <Wallet className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-sm">Tap here to connect and view your portfolio</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wallet balances */}
            <div className="swap-card p-4 sm:p-6 animate-slide-up backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Wallet Value</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>
                <button onClick={refetch} className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all" disabled={loading}>
                  <RefreshCw className={`w-5 h-5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
              {priceError && (
                <p className="text-yellow-500 text-xs mb-3">⚠️ Price data may be inaccurate</p>
              )}
              {balances.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No tokens found</p>
              ) : (
                <div className="space-y-2">
                  {balances.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all">
                      <div className="flex items-center gap-3">
                        {token.logoURI && <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full" />}
                        <div>
                          <p className="font-semibold text-foreground text-sm">{token.symbol}</p>
                          <p className="text-xs text-muted-foreground">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm tabular-nums">{token.balance}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">${token.balanceUsd.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Swap History */}
            <SwapHistory />

            {/* NFT unlock reveal only */}
            <NftGallery treesPlanted={treesPlanted} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
