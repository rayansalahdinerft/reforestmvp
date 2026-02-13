import { useState } from "react";
import { Lock, Check, TreePine, Trees, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  index: number;
  total: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "infinity";
}

const rarityConfig = {
  common: {
    accent: "text-emerald-300",
    border: "border-emerald-400/50",
    bg: "from-emerald-900/80 to-emerald-950/90",
    shimmer: "from-emerald-100/0 via-emerald-100/20 to-emerald-100/0",
    glow: "shadow-emerald-500/15",
    icon: "text-emerald-300",
    ring: "ring-emerald-400/30",
    cardBg: "bg-gradient-to-br from-emerald-950 to-green-950",
    tierLabel: "Basique",
    tierColor: "text-emerald-400",
  },
  uncommon: {
    accent: "text-blue-300",
    border: "border-blue-400/50",
    bg: "from-blue-900/80 to-indigo-950/90",
    shimmer: "from-blue-100/0 via-blue-100/25 to-blue-100/0",
    glow: "shadow-blue-500/20",
    icon: "text-blue-300",
    ring: "ring-blue-400/30",
    cardBg: "bg-gradient-to-br from-blue-950 to-indigo-950",
    tierLabel: "Bronze",
    tierColor: "text-blue-400",
  },
  rare: {
    accent: "text-purple-300",
    border: "border-purple-400/50",
    bg: "from-purple-900/80 to-violet-950/90",
    shimmer: "from-purple-100/0 via-purple-100/30 to-purple-100/0",
    glow: "shadow-purple-500/25",
    icon: "text-purple-300",
    ring: "ring-purple-400/35",
    cardBg: "bg-gradient-to-br from-purple-950 to-violet-950",
    tierLabel: "Argent",
    tierColor: "text-purple-400",
  },
  epic: {
    accent: "text-orange-300",
    border: "border-orange-400/60",
    bg: "from-orange-900/80 to-amber-950/90",
    shimmer: "from-orange-100/0 via-orange-100/35 to-orange-100/0",
    glow: "shadow-orange-500/30",
    icon: "text-orange-300",
    ring: "ring-orange-400/40",
    cardBg: "bg-gradient-to-br from-orange-950 to-amber-950",
    tierLabel: "Or",
    tierColor: "text-orange-400",
  },
  legendary: {
    accent: "text-yellow-200",
    border: "border-yellow-400/70",
    bg: "from-yellow-800/80 to-amber-900/90",
    shimmer: "from-yellow-50/0 via-yellow-50/40 to-yellow-50/0",
    glow: "shadow-yellow-500/35",
    icon: "text-yellow-200",
    ring: "ring-yellow-400/50",
    cardBg: "bg-gradient-to-br from-yellow-950 to-amber-950",
    tierLabel: "Platine",
    tierColor: "text-yellow-300",
  },
  mythic: {
    accent: "text-red-200",
    border: "border-red-400/70",
    bg: "from-red-800/80 to-rose-900/90",
    shimmer: "from-red-50/0 via-red-50/40 to-red-50/0",
    glow: "shadow-red-500/40",
    icon: "text-red-200",
    ring: "ring-red-400/50",
    cardBg: "bg-gradient-to-br from-red-950 to-rose-950",
    tierLabel: "Diamant",
    tierColor: "text-red-300",
  },
  infinity: {
    accent: "text-violet-200",
    border: "border-violet-400/70",
    bg: "from-violet-800/70 via-fuchsia-800/60 to-cyan-800/70",
    shimmer: "from-white/0 via-white/30 to-white/0",
    glow: "shadow-violet-500/50",
    icon: "text-violet-200",
    ring: "ring-violet-400/50",
    cardBg: "bg-gradient-to-br from-violet-950 via-fuchsia-950 to-cyan-950",
    tierLabel: "Éternel",
    tierColor: "text-violet-300",
  },
};

const NftCertificate = ({
  milestone,
  label,
  description,
  current,
  index,
  total,
  rarity,
}: NftCertificateProps) => {
  const unlocked = current >= milestone;
  const config = rarityConfig[rarity];
  const [flipped, setFlipped] = useState(false);
  const isMythic = rarity === "mythic" || rarity === "infinity";
  const isInfinity = rarity === "infinity";

  // Stacked offset: cards fan out from left, each shifted right and slightly rotated
  const offsetX = index * 42;
  const rotation = (index - (total - 1) / 2) * 2.5; // slight fan rotation

  return (
    <div
      className="absolute top-0 left-0 w-[160px] sm:w-[180px] aspect-[2.5/3.5] transition-all duration-300 ease-out hover:z-30"
      style={{
        transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
        zIndex: flipped ? 30 : 10 + index,
        perspective: "900px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `translateX(${offsetX}px) rotate(0deg) translateY(-16px) scale(1.08)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `translateX(${offsetX}px) rotate(${rotation}deg)`;
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
            !unlocked && "opacity-40 grayscale-[50%]",
            isMythic && unlocked && "border-transparent"
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Dark base */}
          <div className={cn("absolute inset-0", unlocked ? config.cardBg : "bg-card/90")} />
          {/* Gradient overlay */}
          <div className={cn("absolute inset-0 bg-gradient-to-b", unlocked ? config.bg : "from-muted/10 to-muted/5")} />

          {/* Holographic rainbow for mythic+ */}
          {isMythic && unlocked && (
            <div
              className="absolute inset-0 opacity-25 mix-blend-screen"
              style={{
                background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
                backgroundSize: "400% 400%",
                animation: "holo-shift 4s ease infinite",
              }}
            />
          )}

          {/* Rainbow border glow for mythic+ */}
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

          {/* Inner frame */}
          <div className={cn(
            "absolute inset-2 rounded-xl border",
            isMythic && unlocked ? "border-white/10" : unlocked ? config.border : "border-border/10"
          )} />

          {/* Shimmer */}
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

          {/* Sparkle particles for Infinity */}
          {isInfinity && unlocked && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: `${10 + Math.random() * 80}%`,
                    animation: `sparkle-float ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: 0,
                  }}
                />
              ))}
            </div>
          )}

          {/* Card content */}
          <div className="relative h-full flex flex-col items-center justify-between p-3 py-4">
            {/* Tier label */}
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-[0.15em]",
              unlocked ? config.tierColor : "text-muted-foreground/40"
            )}>
              {config.tierLabel}
            </span>

            {/* Center: tree icon */}
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center border",
                unlocked ? `bg-gradient-to-br ${config.bg} ${config.border}` : "bg-muted/15 border-border/10"
              )}>
                <TreePine className={cn("w-6 h-6", unlocked ? config.icon : "text-muted-foreground/20")} />
              </div>
              <h4 className={cn(
                "text-xs font-bold tracking-tight",
                unlocked ? config.accent : "text-muted-foreground/40"
              )}>
                {label}
              </h4>
            </div>

            {/* Bottom: milestone */}
            <div className="flex flex-col items-center gap-0.5">
              <p className={cn(
                "text-[10px] font-bold tabular-nums",
                unlocked ? config.accent : "text-muted-foreground/30"
              )}>
                {milestone.toLocaleString()} 🌳
              </p>
              {unlocked ? (
                <div className="flex items-center gap-1">
                  <Check className="w-2.5 h-2.5 text-primary" />
                  <span className="text-[8px] font-bold text-primary uppercase tracking-wider">Owned</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-muted-foreground/30" />
                  <span className="text-[8px] text-muted-foreground/30 uppercase tracking-wider">Locked</span>
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
          <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-muted/5" />
          <div className="absolute inset-2 rounded-xl border border-border/10" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 9px)`,
          }} />

          <div className="relative h-full flex flex-col items-center justify-center gap-3 p-4">
            {unlocked ? (
              <>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border bg-gradient-to-br",
                  config.bg, config.border
                )}>
                  <Check className={cn("w-6 h-6", config.icon)} />
                </div>
                <p className={cn("text-xs font-bold", config.accent)}>Collected</p>
                <p className="text-[9px] text-muted-foreground text-center leading-relaxed">
                  {description}
                </p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-muted/15 border border-border/15 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-muted-foreground/25" />
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
