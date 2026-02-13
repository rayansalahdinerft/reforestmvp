import { useState } from "react";
import { Lock, Check, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

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
    border: "border-emerald-400/40",
    bg: "from-emerald-500/20 via-emerald-600/10 to-green-900/20",
    shimmer: "from-emerald-300/0 via-emerald-300/20 to-emerald-300/0",
    glow: "shadow-emerald-500/25",
    icon: "text-emerald-400",
    ring: "ring-emerald-400/20",
  },
  uncommon: {
    accent: "text-blue-400",
    border: "border-blue-400/40",
    bg: "from-blue-500/20 via-blue-600/10 to-indigo-900/20",
    shimmer: "from-blue-300/0 via-blue-300/20 to-blue-300/0",
    glow: "shadow-blue-500/25",
    icon: "text-blue-400",
    ring: "ring-blue-400/20",
  },
  rare: {
    accent: "text-purple-400",
    border: "border-purple-400/40",
    bg: "from-purple-500/20 via-purple-600/10 to-violet-900/20",
    shimmer: "from-purple-300/0 via-purple-300/25 to-purple-300/0",
    glow: "shadow-purple-500/25",
    icon: "text-purple-400",
    ring: "ring-purple-400/20",
  },
  epic: {
    accent: "text-orange-400",
    border: "border-orange-400/40",
    bg: "from-orange-500/20 via-amber-600/10 to-orange-900/20",
    shimmer: "from-orange-300/0 via-orange-300/25 to-orange-300/0",
    glow: "shadow-orange-500/30",
    icon: "text-orange-400",
    ring: "ring-orange-400/20",
  },
  legendary: {
    accent: "text-yellow-400",
    border: "border-yellow-400/50",
    bg: "from-yellow-500/25 via-amber-500/15 to-yellow-900/20",
    shimmer: "from-yellow-200/0 via-yellow-200/30 to-yellow-200/0",
    glow: "shadow-yellow-500/30",
    icon: "text-yellow-400",
    ring: "ring-yellow-400/25",
  },
  mythic: {
    accent: "text-red-400",
    border: "border-red-400/50",
    bg: "from-red-500/25 via-rose-500/15 to-red-900/20",
    shimmer: "from-red-200/0 via-red-200/30 to-red-200/0",
    glow: "shadow-red-500/30",
    icon: "text-red-400",
    ring: "ring-red-400/25",
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

  return (
    <div
      className="animate-slide-up aspect-[2.5/3.5]"
      style={{
        perspective: "900px",
        animationDelay: `${index * 0.07}s`,
      }}
    >
      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative cursor-pointer w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===== FRONT ===== */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl border-2 overflow-hidden ring-1",
            unlocked ? config.border : "border-border/20",
            unlocked ? config.ring : "ring-transparent",
            unlocked && `shadow-xl ${config.glow}`,
            !unlocked && "opacity-50 grayscale-[30%]"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Card background */}
          <div className={cn("absolute inset-0 bg-gradient-to-b", unlocked ? config.bg : "from-muted/15 to-muted/5")} />

          {/* Inner border frame */}
          <div className={cn(
            "absolute inset-2 rounded-xl border",
            unlocked ? config.border : "border-border/10"
          )} />

          {/* Shimmer effect */}
          {unlocked && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={cn(
                  "absolute -inset-full bg-gradient-to-r w-[200%]",
                  config.shimmer
                )}
                style={{
                  animation: "card-shimmer 3s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Card content */}
          <div className="relative h-full flex flex-col items-center justify-between p-4 py-5">
            {/* Rarity tag */}
            <span className={cn(
              "text-[7px] font-black uppercase tracking-[0.2em]",
              unlocked ? config.accent : "text-muted-foreground/40"
            )}>
              {rarity}
            </span>

            {/* Center icon area */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border",
                unlocked ? `bg-gradient-to-br ${config.bg} ${config.border}` : "bg-muted/20 border-border/10"
              )}>
                <TreePine className={cn("w-6 h-6", unlocked ? config.icon : "text-muted-foreground/30")} />
              </div>

              <h4 className={cn(
                "font-extrabold text-base tracking-tight",
                unlocked ? "text-foreground" : "text-muted-foreground/60"
              )}>
                {label}
              </h4>
            </div>

            {/* Bottom stats */}
            <div className="flex flex-col items-center gap-1">
              <p className={cn(
                "text-[10px] font-bold tabular-nums",
                unlocked ? config.accent : "text-muted-foreground/40"
              )}>
                {milestone.toLocaleString()} 🌳
              </p>
              {unlocked && (
                <div className="flex items-center gap-1">
                  <Check className="w-2.5 h-2.5 text-primary" />
                  <span className="text-[8px] font-bold text-primary uppercase tracking-wider">Owned</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl border-2 overflow-hidden",
            "border-border/20 bg-card/80"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Card back pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-muted/5" />
          <div className="absolute inset-2 rounded-xl border border-border/10" />

          {/* Repeating pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 9px)`,
          }} />

          <div className="relative h-full flex flex-col items-center justify-center gap-3 p-4">
            {unlocked ? (
              <>
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center border bg-gradient-to-br",
                  config.bg, config.border
                )}>
                  <Check className={cn("w-7 h-7", config.icon)} />
                </div>
                <p className={cn("text-xs font-bold", config.accent)}>Collected</p>
                <p className="text-[9px] text-muted-foreground text-center leading-relaxed">
                  Proof of Impact
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-xl bg-muted/15 border border-border/15 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-muted-foreground/25" />
                </div>
                <p className="text-xs text-muted-foreground/60 font-semibold">Locked</p>
                <p className="text-[9px] text-muted-foreground/40 text-center">
                  Plant {milestone.toLocaleString()} trees
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
