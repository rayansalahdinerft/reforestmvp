import { Lock, Award, Download, ExternalLink } from "lucide-react";
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
    border: "border-green-500/30",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.15)]",
    gradient: "from-green-600/20 via-emerald-500/10 to-green-700/20",
    badgeBg: "bg-green-500/20 text-green-400",
    headerGradient: "from-green-400 to-emerald-500",
    ring: "ring-green-500/20",
  },
  uncommon: {
    border: "border-blue-500/30",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    gradient: "from-blue-600/20 via-cyan-500/10 to-blue-700/20",
    badgeBg: "bg-blue-500/20 text-blue-400",
    headerGradient: "from-blue-400 to-cyan-500",
    ring: "ring-blue-500/20",
  },
  rare: {
    border: "border-purple-500/30",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    gradient: "from-purple-600/20 via-violet-500/10 to-purple-700/20",
    badgeBg: "bg-purple-500/20 text-purple-400",
    headerGradient: "from-purple-400 to-violet-500",
    ring: "ring-purple-500/20",
  },
  epic: {
    border: "border-orange-500/30",
    glow: "shadow-[0_0_35px_rgba(249,115,22,0.2)]",
    gradient: "from-orange-600/20 via-amber-500/10 to-orange-700/20",
    badgeBg: "bg-orange-500/20 text-orange-400",
    headerGradient: "from-orange-400 to-amber-500",
    ring: "ring-orange-500/20",
  },
  legendary: {
    border: "border-yellow-500/40",
    glow: "shadow-[0_0_40px_rgba(234,179,8,0.25)]",
    gradient: "from-yellow-600/20 via-amber-400/15 to-yellow-700/20",
    badgeBg: "bg-yellow-500/20 text-yellow-400",
    headerGradient: "from-yellow-400 to-amber-400",
    ring: "ring-yellow-500/30",
  },
  mythic: {
    border: "border-red-500/40",
    glow: "shadow-[0_0_50px_rgba(239,68,68,0.25)]",
    gradient: "from-red-600/20 via-rose-500/15 to-red-700/20",
    badgeBg: "bg-red-500/20 text-red-400",
    headerGradient: "from-red-400 to-rose-500",
    ring: "ring-red-500/30",
  },
};

const treeEmojis: Record<string, string> = {
  common: "🌱",
  uncommon: "🌿",
  rare: "🌳",
  epic: "🏔️",
  legendary: "🌍",
  mythic: "✨",
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

  return (
    <div
      className={cn(
        "group relative rounded-3xl border overflow-hidden transition-all duration-500 animate-slide-up",
        unlocked ? config.border : "border-border/40",
        unlocked ? config.glow : "",
        !unlocked && "opacity-50 grayscale"
      )}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Card background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
          unlocked ? config.gradient : "from-muted/20 to-muted/10",
        )}
      />

      {/* Shimmer effect for unlocked */}
      {unlocked && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
        </div>
      )}

      <div className="relative p-5">
        {/* Header: Rarity + ID */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
              unlocked ? config.badgeBg : "bg-muted/30 text-muted-foreground"
            )}
          >
            {rarity}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            #{String(index + 1).padStart(4, "0")}
          </span>
        </div>

        {/* Icon area */}
        <div className="flex justify-center my-5">
          <div
            className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-transform duration-300",
              unlocked
                ? `bg-gradient-to-br ${config.gradient} ring-1 ${config.ring} group-hover:scale-110`
                : "bg-muted/30"
            )}
          >
            {unlocked ? (
              treeEmojis[rarity]
            ) : (
              <Lock className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Title */}
        <h4
          className={cn(
            "text-center font-bold text-lg mb-1",
            unlocked
              ? `text-transparent bg-clip-text bg-gradient-to-r ${config.headerGradient}`
              : "text-muted-foreground"
          )}
        >
          {label}
        </h4>

        {/* Milestone */}
        <p className="text-center text-xs text-muted-foreground mb-3">
          {milestone.toLocaleString()} trees planted
        </p>

        {/* Description */}
        <p className="text-center text-xs text-muted-foreground/80 mb-4 leading-relaxed">
          {unlocked ? description : `Plant ${milestone.toLocaleString()} trees to unlock`}
        </p>

        {/* Status / Actions */}
        <div className="flex justify-center">
          {unlocked ? (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <Award className={cn("w-3.5 h-3.5", `text-${rarity === "common" ? "green" : rarity === "uncommon" ? "blue" : rarity === "rare" ? "purple" : rarity === "epic" ? "orange" : rarity === "legendary" ? "yellow" : "red"}-400`)} />
              <span className={cn(
                "text-transparent bg-clip-text bg-gradient-to-r",
                config.headerGradient
              )}>
                UNLOCKED
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/60 font-medium">
              🔒 LOCKED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftCertificate;
