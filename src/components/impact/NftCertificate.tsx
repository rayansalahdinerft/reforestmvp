import { useState } from "react";
import { Lock, Check, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import leafIcon from "@/assets/leaf-icon.png";

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  index: number;
  total: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "infinity";
}

// Progressive card styles: basic → premium → gold → platinum → black
const rarityConfig = {
  common: {
    // Basic blue card
    cardBg: "from-[#1a2744] via-[#1e3050] to-[#162540]",
    accent: "text-blue-200/80",
    textColor: "text-blue-100",
    subtextColor: "text-blue-300/60",
    border: "border-blue-400/20",
    chipBg: "bg-blue-300/10",
    numberStyle: "text-blue-100/90",
    shimmer: false,
    holographic: false,
  },
  uncommon: {
    // Deeper blue with subtle pattern
    cardBg: "from-[#182d55] via-[#1a3668] to-[#14284a]",
    accent: "text-blue-100",
    textColor: "text-blue-50",
    subtextColor: "text-blue-200/60",
    border: "border-blue-300/25",
    chipBg: "bg-blue-200/10",
    numberStyle: "text-blue-50",
    shimmer: false,
    holographic: false,
  },
  rare: {
    // Gold card
    cardBg: "from-[#8B7530] via-[#C5A748] to-[#8B7530]",
    accent: "text-yellow-100",
    textColor: "text-yellow-50",
    subtextColor: "text-yellow-200/70",
    border: "border-yellow-300/40",
    chipBg: "bg-yellow-200/15",
    numberStyle: "text-yellow-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
    shimmer: true,
    holographic: false,
  },
  epic: {
    // Platinum / Silver card
    cardBg: "from-[#8a8a8a] via-[#c0c0c0] to-[#8a8a8a]",
    accent: "text-gray-100",
    textColor: "text-white",
    subtextColor: "text-gray-200/70",
    border: "border-white/30",
    chipBg: "bg-white/10",
    numberStyle: "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
    shimmer: true,
    holographic: false,
  },
  legendary: {
    // Black premium card
    cardBg: "from-[#1a1a1a] via-[#2a2a2a] to-[#111111]",
    accent: "text-gray-300",
    textColor: "text-white",
    subtextColor: "text-gray-400",
    border: "border-gray-600/40",
    chipBg: "bg-white/5",
    numberStyle: "text-white font-light tracking-wider",
    shimmer: true,
    holographic: false,
  },
  mythic: {
    // Black + gold accents
    cardBg: "from-[#0d0d0d] via-[#1a1a1a] to-[#0a0a0a]",
    accent: "text-amber-300",
    textColor: "text-amber-100",
    subtextColor: "text-amber-400/60",
    border: "border-amber-500/30",
    chipBg: "bg-amber-400/10",
    numberStyle: "text-amber-200 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]",
    shimmer: true,
    holographic: true,
  },
  infinity: {
    // Ultra premium — dark with rainbow accents
    cardBg: "from-[#0a0a12] via-[#12121f] to-[#080810]",
    accent: "text-violet-200",
    textColor: "text-white",
    subtextColor: "text-violet-300/60",
    border: "border-violet-400/30",
    chipBg: "bg-violet-400/10",
    numberStyle: "text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.4)]",
    shimmer: true,
    holographic: true,
  },
};

const formatTreeCount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
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

  // Stacked offset
  const offsetX = index * 48;
  const rotation = (index - (total - 1) / 2) * 2;

  return (
    <div
      className="absolute top-0 left-0 w-[200px] sm:w-[220px] transition-all duration-300 ease-out"
      style={{
        aspectRatio: "85.6/53.98", // standard card ratio
        transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
        zIndex: flipped ? 30 : 10 + index,
        perspective: "1000px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `translateX(${offsetX}px) rotate(0deg) translateY(-14px) scale(1.06)`;
        (e.currentTarget as HTMLElement).style.zIndex = "25";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `translateX(${offsetX}px) rotate(${rotation}deg)`;
        (e.currentTarget as HTMLElement).style.zIndex = `${flipped ? 30 : 10 + index}`;
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
        {/* ===== FRONT — Credit Card Style ===== */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden border",
            unlocked ? config.border : "border-border/15",
            !unlocked && "opacity-40 grayscale-[60%] saturate-50",
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Card background */}
          <div className={cn("absolute inset-0 bg-gradient-to-br", unlocked ? config.cardBg : "from-muted/30 to-muted/10")} />

          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)",
          }} />

          {/* Shimmer for premium cards */}
          {config.shimmer && unlocked && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute -inset-full bg-gradient-to-r from-white/0 via-white/15 to-white/0 w-[200%]"
                style={{ animation: "card-shimmer 3s ease-in-out infinite" }}
              />
            </div>
          )}

          {/* Holographic effect for mythic+ */}
          {config.holographic && unlocked && (
            <div
              className="absolute inset-0 opacity-15 mix-blend-screen"
              style={{
                background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
                backgroundSize: "400% 400%",
                animation: "holo-shift 4s ease infinite",
              }}
            />
          )}

          {/* Sparkle particles for Infinity */}
          {rarity === "infinity" && unlocked && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full bg-white"
                  style={{
                    left: `${15 + Math.random() * 70}%`,
                    top: `${15 + Math.random() * 70}%`,
                    animation: `sparkle-float ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: 0,
                  }}
                />
              ))}
            </div>
          )}

          {/* === Card Content Layout (like a credit card) === */}
          <div className="relative h-full flex flex-col justify-between p-3 sm:p-4">
            {/* Top row: Logo + NFC chip area */}
            <div className="flex items-start justify-between">
              {/* ReforestWallet logo */}
              <div className="flex items-center gap-1.5">
                <img src={leafIcon} alt="" className="w-5 h-5 sm:w-6 sm:h-6 rounded-md" />
                <span className={cn("text-[8px] sm:text-[9px] font-bold tracking-tight leading-none", config.textColor)}>
                  Reforest<span className="text-primary">Wallet</span>
                </span>
              </div>
              {/* Chip icon area */}
              {unlocked && (
                <div className={cn("w-7 h-5 sm:w-8 sm:h-6 rounded-sm border flex items-center justify-center", config.chipBg, config.border)}>
                  <div className="w-4 h-3 sm:w-5 sm:h-4 rounded-[2px] border border-current opacity-40" style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                  }} />
                </div>
              )}
            </div>

            {/* Middle: Tree count — large embossed number */}
            <div className="flex-1 flex items-center">
              <p className={cn(
                "text-xl sm:text-2xl font-bold tracking-[0.08em] tabular-nums",
                unlocked ? config.numberStyle : "text-muted-foreground/25"
              )} style={{
                textShadow: unlocked ? "0 1px 0 rgba(255,255,255,0.1), 0 -1px 0 rgba(0,0,0,0.3)" : "none",
                letterSpacing: "0.12em",
              }}>
                {milestone.toLocaleString()} 🌳
              </p>
            </div>

            {/* Bottom row: Card name + status */}
            <div className="flex items-end justify-between">
              <div>
                <p className={cn(
                  "text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em]",
                  unlocked ? config.textColor : "text-muted-foreground/30"
                )} style={{
                  textShadow: unlocked ? "0 1px 0 rgba(0,0,0,0.3)" : "none",
                }}>
                  {label}
                </p>
                {unlocked && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[7px] sm:text-[8px] font-bold text-primary uppercase tracking-wider">Owned</span>
                  </div>
                )}
                {!unlocked && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Lock className="w-2.5 h-2.5 text-muted-foreground/25" />
                    <span className="text-[7px] sm:text-[8px] text-muted-foreground/25 uppercase tracking-wider">Locked</span>
                  </div>
                )}
              </div>
              {/* Contactless icon area */}
              <div className={cn("opacity-40", unlocked ? config.subtextColor : "text-muted-foreground/20")}>
                <TreePine className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          className={cn(
            "absolute inset-0 rounded-xl overflow-hidden border",
            "border-border/20"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className={cn("absolute inset-0 bg-gradient-to-br", unlocked ? config.cardBg : "from-muted/20 to-muted/10")} />

          {/* Magnetic stripe */}
          <div className="absolute top-[18%] left-0 right-0 h-[14%] bg-black/60" />

          <div className="relative h-full flex flex-col items-center justify-end gap-2 p-4 pb-5">
            {unlocked ? (
              <>
                <div className="flex items-center gap-1.5">
                  <Check className={cn("w-4 h-4", config.accent)} />
                  <p className={cn("text-xs font-bold", config.accent)}>Proof of Impact</p>
                </div>
                <p className={cn("text-[9px] text-center leading-relaxed", config.subtextColor)}>
                  {description}
                </p>
                <p className={cn("text-[8px] font-mono tracking-widest", config.subtextColor)}>
                  {formatTreeCount(milestone)} TREES • NFT
                </p>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-muted-foreground/25" />
                <p className="text-xs text-muted-foreground/50 font-semibold">Locked</p>
                <p className="text-[9px] text-muted-foreground/35 text-center">
                  Plant {milestone.toLocaleString()} trees to unlock
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
