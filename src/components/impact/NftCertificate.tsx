import { useState } from "react";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import explorerAvatar from "@/assets/levels/explorer.png";
import seedAvatar from "@/assets/levels/seed.png";
import sproutAvatar from "@/assets/levels/sprout.png";
import rootsAvatar from "@/assets/levels/roots.png";
import canopyAvatar from "@/assets/levels/canopy.png";
import forestAvatar from "@/assets/levels/forest.png";
import legendAvatar from "@/assets/levels/legend.png";
import infinityAvatar from "@/assets/levels/infinity.png";

const avatarMap: Record<string, string> = {
  Sprout: sproutAvatar,
  Roots: rootsAvatar,
  Canopy: canopyAvatar,
  Forest: forestAvatar,
  Legend: legendAvatar,
  Infinity: infinityAvatar,
};

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  index: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
}

const rarityConfig = {
  common: {
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "from-emerald-500/15 to-emerald-600/5",
    gradient: "from-emerald-400 to-green-500",
    glow: "shadow-emerald-500/15",
  },
  uncommon: {
    accent: "text-blue-400",
    border: "border-blue-500/30",
    bg: "from-blue-500/15 to-blue-600/5",
    gradient: "from-blue-400 to-cyan-500",
    glow: "shadow-blue-500/15",
  },
  rare: {
    accent: "text-purple-400",
    border: "border-purple-500/30",
    bg: "from-purple-500/15 to-purple-600/5",
    gradient: "from-purple-400 to-violet-500",
    glow: "shadow-purple-500/15",
  },
  epic: {
    accent: "text-orange-400",
    border: "border-orange-500/30",
    bg: "from-orange-500/15 to-orange-600/5",
    gradient: "from-orange-400 to-amber-500",
    glow: "shadow-orange-500/15",
  },
  legendary: {
    accent: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "from-yellow-500/15 to-amber-500/5",
    gradient: "from-yellow-300 to-amber-400",
    glow: "shadow-yellow-500/20",
  },
  mythic: {
    accent: "text-red-400",
    border: "border-red-500/30",
    bg: "from-red-500/15 to-rose-500/5",
    gradient: "from-red-400 to-rose-500",
    glow: "shadow-red-500/20",
  },
};

const NftCertificate = ({
  milestone,
  label,
  description,
  current,
  index,
  rarity,
}: NftCertificateProps) => {
  const unlocked = current >= milestone;
  const config = rarityConfig[rarity];
  const [flipped, setFlipped] = useState(false);
  const avatar = avatarMap[label];

  return (
    <div
      className="animate-slide-up"
      style={{
        perspective: "800px",
        animationDelay: `${index * 0.06}s`,
      }}
    >
      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative cursor-pointer w-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===== FRONT ===== */}
        <div
          className={cn(
            "rounded-2xl border overflow-hidden transition-shadow duration-300",
            unlocked ? config.border : "border-border/30",
            unlocked && `shadow-lg ${config.glow}`,
            !unlocked && "opacity-60"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Background gradient */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              unlocked ? config.bg : "from-muted/10 to-muted/5"
            )}
          />

          <div className="relative p-4 flex flex-col items-center text-center gap-2">
            {/* Rarity badge */}
            <span
              className={cn(
                "text-[8px] font-bold uppercase tracking-widest",
                unlocked ? config.accent : "text-muted-foreground/50"
              )}
            >
              {rarity}
            </span>

            {/* Avatar */}
            {avatar && (
              <div
                className={cn(
                  "w-14 h-14 rounded-xl overflow-hidden border",
                  unlocked ? config.border : "border-border/20"
                )}
              >
                <img
                  src={avatar}
                  alt={label}
                  className={cn(
                    "w-full h-full object-cover",
                    !unlocked && "grayscale opacity-40"
                  )}
                />
              </div>
            )}

            {/* Label */}
            <h4
              className={cn(
                "font-bold text-sm",
                unlocked ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </h4>

            {/* Milestone */}
            <p className="text-[10px] text-muted-foreground tabular-nums">
              {milestone.toLocaleString()} trees
            </p>

            {/* Status */}
            {unlocked ? (
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                <span className={cn("text-[10px] font-semibold", config.accent)}>
                  Unlocked
                </span>
              </div>
            ) : (
              <p className="text-[9px] text-muted-foreground">Tap to flip</p>
            )}
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl border overflow-hidden flex flex-col items-center justify-center gap-3",
            unlocked ? config.border : "border-border/30",
            unlocked ? "bg-card/90" : "bg-muted/40"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              unlocked ? config.bg : "from-muted/20 to-muted/10"
            )}
          />

          <div className="relative flex flex-col items-center gap-2 p-4 text-center">
            {unlocked ? (
              <>
                <Check className="w-8 h-8 text-primary" />
                <p className={cn("text-sm font-bold", config.accent)}>
                  Collected!
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Proof of Impact NFT
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Locked
                </p>
                <p className="text-[10px] text-muted-foreground/70">
                  {milestone.toLocaleString()} trees to unlock
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCertificate;
