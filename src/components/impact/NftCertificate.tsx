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
    accent: "text-emerald-300",
    border: "border-emerald-400/50",
    bg: "from-emerald-500/30 via-emerald-600/15 to-green-800/25",
    shimmer: "from-emerald-200/0 via-emerald-200/30 to-emerald-200/0",
    glow: "shadow-emerald-400/30",
    icon: "text-emerald-300",
    ring: "ring-emerald-400/30",
  },
  uncommon: {
    accent: "text-blue-300",
    border: "border-blue-400/50",
    bg: "from-blue-500/30 via-blue-600/15 to-indigo-800/25",
    shimmer: "from-blue-200/0 via-blue-200/30 to-blue-200/0",
    glow: "shadow-blue-400/30",
    icon: "text-blue-300",
    ring: "ring-blue-400/30",
  },
  rare: {
    accent: "text-purple-300",
    border: "border-purple-400/50",
    bg: "from-purple-500/30 via-purple-600/15 to-violet-800/25",
    shimmer: "from-purple-200/0 via-purple-200/35 to-purple-200/0",
    glow: "shadow-purple-400/30",
    icon: "text-purple-300",
    ring: "ring-purple-400/30",
  },
  epic: {
    accent: "text-orange-300",
    border: "border-orange-400/50",
    bg: "from-orange-500/30 via-amber-600/15 to-orange-800/25",
    shimmer: "from-orange-200/0 via-orange-200/35 to-orange-200/0",
    glow: "shadow-orange-400/35",
    icon: "text-orange-300",
    ring: "ring-orange-400/30",
  },
  legendary: {
    accent: "text-yellow-300",
    border: "border-yellow-400/60",
    bg: "from-yellow-500/35 via-amber-500/20 to-yellow-800/25",
    shimmer: "from-yellow-100/0 via-yellow-100/40 to-yellow-100/0",
    glow: "shadow-yellow-400/40",
    icon: "text-yellow-300",
    ring: "ring-yellow-400/35",
  },
  mythic: {
    accent: "text-red-300",
    border: "border-red-400/60",
    bg: "from-red-500/35 via-rose-500/20 to-red-800/25",
    shimmer: "from-red-100/0 via-red-100/40 to-red-100/0",
    glow: "shadow-red-400/40",
    icon: "text-red-300",
    ring: "ring-red-400/35",
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
  const isMythic = rarity === "mythic";

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
            !unlocked && "opacity-50 grayscale-[30%]",
            isMythic && unlocked && "border-transparent"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Card background */}
          <div className={cn("absolute inset-0 bg-gradient-to-b", unlocked ? config.bg : "from-muted/15 to-muted/5")} />

          {/* Holographic rainbow overlay for mythic */}
          {isMythic && unlocked && (
            <div
              className="absolute inset-0 opacity-30 mix-blend-screen"
              style={{
                background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
                backgroundSize: "400% 400%",
                animation: "holo-shift 4s ease infinite",
              }}
            />
          )}

          {/* Mythic rainbow border glow */}
          {isMythic && unlocked && (
            <div
              className="absolute -inset-[1px] rounded-2xl -z-10"
              style={{
                background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
                backgroundSize: "300% 300%",
                animation: "holo-shift 3s ease infinite",
                filter: "blur(4px)",
              }}
            />
          )}

          {/* Inner border frame */}
          <div className={cn(
            "absolute inset-2 rounded-xl border",
            isMythic && unlocked ? "border-white/10" : unlocked ? config.border : "border-border/10"
          )} />

          {/* Shimmer effect */}
          {unlocked && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={cn(
                  "absolute -inset-full bg-gradient-to-r w-[200%]",
                  isMythic ? "from-white/0 via-white/25 to-white/0" : config.shimmer
                )}
                style={{
                  animation: isMythic ? "card-shimmer 2s ease-in-out infinite" : "card-shimmer 3s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Card content */}
          <div className="relative h-full flex flex-col items-center justify-between p-4 py-5">
            {/* Label at top */}
            <h4 className={cn(
              "font-extrabold text-sm tracking-tight",
              unlocked ? config.accent : "text-muted-foreground/50"
            )}>
              {label}
            </h4>

            {/* Center icon */}
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center border",
              unlocked ? `bg-gradient-to-br ${config.bg} ${config.border}` : "bg-muted/15 border-border/10"
            )}>
              <TreePine className={cn("w-7 h-7", unlocked ? config.icon : "text-muted-foreground/20")} />
            </div>

            {/* Bottom: milestone + status */}
            <div className="flex flex-col items-center gap-1">
              <p className={cn(
                "text-[10px] font-bold tabular-nums",
                unlocked ? config.accent : "text-muted-foreground/35"
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
