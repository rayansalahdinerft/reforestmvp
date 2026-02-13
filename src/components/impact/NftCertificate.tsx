import { useState } from "react";
import { Lock, Check, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  index: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "infinity";
}

const rarityConfig = {
  common: {
    accent: "text-emerald-200",
    border: "border-emerald-300/60",
    bg: "from-emerald-400/45 via-emerald-500/25 to-green-700/35",
    shimmer: "from-emerald-100/0 via-emerald-100/40 to-emerald-100/0",
    glow: "shadow-emerald-300/40",
    icon: "text-emerald-200",
    ring: "ring-emerald-300/40",
  },
  uncommon: {
    accent: "text-blue-200",
    border: "border-blue-300/60",
    bg: "from-blue-400/45 via-blue-500/25 to-indigo-700/35",
    shimmer: "from-blue-100/0 via-blue-100/40 to-blue-100/0",
    glow: "shadow-blue-300/40",
    icon: "text-blue-200",
    ring: "ring-blue-300/40",
  },
  rare: {
    accent: "text-purple-200",
    border: "border-purple-300/60",
    bg: "from-purple-400/45 via-purple-500/25 to-violet-700/35",
    shimmer: "from-purple-100/0 via-purple-100/45 to-purple-100/0",
    glow: "shadow-purple-300/40",
    icon: "text-purple-200",
    ring: "ring-purple-300/40",
  },
  epic: {
    accent: "text-orange-200",
    border: "border-orange-300/60",
    bg: "from-orange-400/45 via-amber-500/25 to-orange-700/35",
    shimmer: "from-orange-100/0 via-orange-100/45 to-orange-100/0",
    glow: "shadow-orange-300/45",
    icon: "text-orange-200",
    ring: "ring-orange-300/40",
  },
  legendary: {
    accent: "text-yellow-200",
    border: "border-yellow-300/70",
    bg: "from-yellow-400/50 via-amber-400/30 to-yellow-700/35",
    shimmer: "from-yellow-50/0 via-yellow-50/50 to-yellow-50/0",
    glow: "shadow-yellow-300/50",
    icon: "text-yellow-200",
    ring: "ring-yellow-300/45",
  },
  mythic: {
    accent: "text-red-200",
    border: "border-red-300/70",
    bg: "from-red-400/50 via-rose-400/30 to-red-700/35",
    shimmer: "from-red-50/0 via-red-50/50 to-red-50/0",
    glow: "shadow-red-300/50",
    icon: "text-red-200",
    ring: "ring-red-300/45",
  },
  infinity: {
    accent: "text-violet-200",
    border: "border-violet-300/70",
    bg: "from-violet-400/50 via-fuchsia-400/30 to-cyan-600/35",
    shimmer: "from-white/0 via-white/40 to-white/0",
    glow: "shadow-violet-300/50",
    icon: "text-violet-200",
    ring: "ring-violet-300/45",
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
  const isMythic = rarity === "mythic" || rarity === "infinity";

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
            {/* Rarity name at top */}
            <h4 className={cn(
              "font-extrabold text-sm tracking-tight capitalize",
              unlocked ? config.accent : "text-muted-foreground/50"
            )}>
              {rarity}
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
