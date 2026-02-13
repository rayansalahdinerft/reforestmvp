import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

import explorerAvatar from "@/assets/levels/explorer.png";
import seedAvatar from "@/assets/levels/seed.png";
import sproutAvatar from "@/assets/levels/sprout.png";
import rootsAvatar from "@/assets/levels/roots.png";
import canopyAvatar from "@/assets/levels/canopy.png";
import forestAvatar from "@/assets/levels/forest.png";
import legendAvatar from "@/assets/levels/legend.png";
import infinityAvatar from "@/assets/levels/infinity.png";

interface Certificate {
  milestone: number;
  label: string;
  avatar: string;
  rarity: string;
  gradient: string;
  glow: string;
  badgeBg: string;
}

const CERTIFICATES: Certificate[] = [
  { milestone: 10, label: "Explorer", avatar: explorerAvatar, rarity: "Starter", gradient: "from-stone-400 to-zinc-500", glow: "shadow-stone-500/20", badgeBg: "bg-stone-500/20 text-stone-400 border-stone-500/30" },
  { milestone: 100, label: "Seed", avatar: seedAvatar, rarity: "Common", gradient: "from-green-400 to-emerald-500", glow: "shadow-green-500/20", badgeBg: "bg-green-500/20 text-green-400 border-green-500/30" },
  { milestone: 1_000, label: "Sprout", avatar: sproutAvatar, rarity: "Uncommon", gradient: "from-blue-400 to-cyan-500", glow: "shadow-blue-500/20", badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { milestone: 10_000, label: "Roots", avatar: rootsAvatar, rarity: "Rare", gradient: "from-purple-400 to-violet-500", glow: "shadow-purple-500/20", badgeBg: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { milestone: 100_000, label: "Canopy", avatar: canopyAvatar, rarity: "Epic", gradient: "from-orange-400 to-amber-500", glow: "shadow-orange-500/20", badgeBg: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { milestone: 1_000_000, label: "Forest", avatar: forestAvatar, rarity: "Legendary", gradient: "from-yellow-300 to-amber-400", glow: "shadow-yellow-500/30", badgeBg: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { milestone: 10_000_000, label: "Legend", avatar: legendAvatar, rarity: "Mythic", gradient: "from-red-400 to-rose-500", glow: "shadow-red-500/30", badgeBg: "bg-red-500/20 text-red-400 border-red-500/30" },
  { milestone: 100_000_000, label: "Infinity", avatar: infinityAvatar, rarity: "Eternal", gradient: "from-violet-400 via-fuchsia-500 to-cyan-400", glow: "shadow-violet-500/40", badgeBg: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
];

interface NftGalleryProps {
  treesPlanted: number;
}

const NftGallery = ({ treesPlanted }: NftGalleryProps) => {
  const unlocked = CERTIFICATES.filter((c) => treesPlanted >= c.milestone);
  const nextCert = CERTIFICATES.find((c) => treesPlanted < c.milestone) ?? null;
  const [revealedCert, setRevealedCert] = useState<Certificate | null>(null);
  const [shownMilestones, setShownMilestones] = useState<Set<number>>(new Set());

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

  const allMaxed = !nextCert;
  const progressToNext = nextCert
    ? Math.min((treesPlanted / nextCert.milestone) * 100, 100)
    : 100;

  return (
    <>
      {/* Unlock reveal overlay */}
      {revealedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg animate-fade-in" onClick={() => setRevealedCert(null)}>
          <div className="relative animate-hero-reveal" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setRevealedCert(null)} className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className={cn(
              "w-72 sm:w-80 p-8 rounded-3xl border border-border/60 bg-card/90 backdrop-blur-xl overflow-hidden relative",
              `shadow-2xl ${revealedCert.glow}`
            )}>
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer" />
              </div>
              <div className="relative flex flex-col items-center text-center gap-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">NFT Unlocked</p>
                <div className="animate-float">
                  <img src={revealedCert.avatar} alt={revealedCert.label} className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
                </div>
                <h3 className={cn("text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r", revealedCert.gradient)}>
                  {revealedCert.label}
                </h3>
                <span className={cn("text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border", revealedCert.badgeBg)}>
                  {revealedCert.rarity}
                </span>
                <p className="text-sm text-muted-foreground">
                  {revealedCert.milestone.toLocaleString()} trees planted
                </p>
                <button
                  onClick={() => setRevealedCert(null)}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Collect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NftGallery;
