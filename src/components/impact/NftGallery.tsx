import { useState, useEffect } from "react";
import { Lock, Award, X } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Certificate {
  milestone: number;
  label: string;
  emoji: string;
  rarity: string;
  gradient: string;
  glow: string;
  badgeBg: string;
}

const CERTIFICATES: Certificate[] = [
  { milestone: 10, label: "Graine Originelle", emoji: "🌱", rarity: "Common", gradient: "from-green-400 to-emerald-500", glow: "shadow-green-500/20", badgeBg: "bg-green-500/20 text-green-400 border-green-500/30" },
  { milestone: 100, label: "Première Pousse", emoji: "🌿", rarity: "Uncommon", gradient: "from-blue-400 to-cyan-500", glow: "shadow-blue-500/20", badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { milestone: 1_000, label: "Gardien des Racines", emoji: "🌾", rarity: "Rare", gradient: "from-purple-400 to-violet-500", glow: "shadow-purple-500/20", badgeBg: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { milestone: 10_000, label: "Esprit de la Canopée", emoji: "🌳", rarity: "Epic", gradient: "from-orange-400 to-amber-500", glow: "shadow-orange-500/20", badgeBg: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { milestone: 100_000, label: "Sentinelle de la Forêt", emoji: "🌲", rarity: "Legendary", gradient: "from-yellow-300 to-amber-400", glow: "shadow-yellow-500/30", badgeBg: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { milestone: 1_000_000, label: "Protecteur de la Biosphère", emoji: "🌍", rarity: "Mythic", gradient: "from-red-400 to-rose-500", glow: "shadow-red-500/30", badgeBg: "bg-red-500/20 text-red-400 border-red-500/30" },
  { milestone: 10_000_000, label: "Légende Originelle", emoji: "⭐", rarity: "Divine", gradient: "from-amber-300 via-yellow-400 to-orange-500", glow: "shadow-amber-500/40", badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
];

interface NftGalleryProps {
  treesPlanted: number;
}

const NftGallery = ({ treesPlanted }: NftGalleryProps) => {
  const unlocked = CERTIFICATES.filter((c) => treesPlanted >= c.milestone);
  const locked = CERTIFICATES.filter((c) => treesPlanted < c.milestone);
  const [revealedCert, setRevealedCert] = useState<Certificate | null>(null);
  const [shownMilestones, setShownMilestones] = useState<Set<number>>(new Set());

  // Detect newly unlocked certificates
  useEffect(() => {
    const stored = localStorage.getItem("reforest_shown_milestones");
    if (stored) {
      setShownMilestones(new Set(JSON.parse(stored)));
    }
  }, []);

  useEffect(() => {
    for (const cert of unlocked) {
      if (!shownMilestones.has(cert.milestone)) {
        setRevealedCert(cert);
        const updated = new Set([...shownMilestones, cert.milestone]);
        setShownMilestones(updated);
        localStorage.setItem("reforest_shown_milestones", JSON.stringify([...updated]));
        break;
      }
    }
  }, [unlocked.length]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#22c55e", "#10b981", "#fbbf24", "#a855f7"],
    });
  };

  useEffect(() => {
    if (revealedCert) {
      const timer = setTimeout(triggerConfetti, 400);
      return () => clearTimeout(timer);
    }
  }, [revealedCert]);

  return (
    <>
      {/* Unlock reveal overlay */}
      {revealedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg animate-fade-in" onClick={() => setRevealedCert(null)}>
          <div className="relative animate-hero-reveal" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setRevealedCert(null)} className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>

            {/* NFT Card — large */}
            <div className={cn(
              "w-72 sm:w-80 p-8 rounded-3xl border border-border/60 bg-card/90 backdrop-blur-xl overflow-hidden relative",
              `shadow-2xl ${revealedCert.glow}`
            )}>
              {/* Shimmer */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer" />
              </div>

              <div className="relative flex flex-col items-center text-center gap-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Certificat débloqué</p>
                
                <div className="animate-float">
                  <span className="text-7xl">{revealedCert.emoji}</span>
                </div>
                
                <h3 className={cn("text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r", revealedCert.gradient)}>
                  {revealedCert.label}
                </h3>
                
                <span className={cn("text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border", revealedCert.badgeBg)}>
                  {revealedCert.rarity}
                </span>
                
                <p className="text-sm text-muted-foreground">
                  {revealedCert.milestone.toLocaleString()} arbres plantés
                </p>

                <button
                  onClick={() => setRevealedCert(null)}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Collecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="swap-card p-6 animate-slide-up backdrop-blur-sm" style={{ animationDelay: "0.15s" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Proof-of-Impact</h3>
            <p className="text-sm text-muted-foreground">
              {unlocked.length}/{CERTIFICATES.length} certificats débloqués
            </p>
          </div>
        </div>

        {/* Unlocked certificates */}
        {unlocked.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {unlocked.map((cert) => (
              <div
                key={cert.milestone}
                className={cn(
                  "group relative p-4 rounded-2xl border border-border/60 bg-card/50 overflow-hidden hover:scale-[1.03] transition-all duration-300 cursor-pointer",
                  `hover:${cert.glow}`
                )}
                onClick={() => setRevealedCert(cert)}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
                </div>

                <div className="relative flex flex-col items-center text-center gap-2">
                  <span className="text-3xl group-hover:animate-subtle-bounce">{cert.emoji}</span>
                  <h4 className={cn("text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r leading-tight", cert.gradient)}>
                    {cert.label}
                  </h4>
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border", cert.badgeBg)}>
                    {cert.rarity}
                  </span>
                  <p className="text-[10px] text-muted-foreground">
                    {cert.milestone.toLocaleString()} 🌳
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Locked certificates */}
        {locked.length > 0 && (
          <div className="space-y-1.5">
            {locked.map((cert, i) => {
              const progressToThis = Math.min((treesPlanted / cert.milestone) * 100, 100);
              return (
                <div
                  key={cert.milestone}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/20 bg-muted/10 opacity-50 hover:opacity-70 transition-opacity"
                >
                  <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-muted-foreground truncate">{cert.label}</p>
                      <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ml-2 shrink-0", cert.badgeBg)}>
                        {cert.rarity}
                      </span>
                    </div>
                    <div className="h-1 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full bg-gradient-to-r opacity-50", cert.gradient)}
                        style={{ width: `${progressToThis}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                      {treesPlanted.toLocaleString()} / {cert.milestone.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default NftGallery;
