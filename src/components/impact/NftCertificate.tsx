import { Lock, Check } from "lucide-react";
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
    border: "border-emerald-500/25",
    bg: "from-emerald-500/10 to-emerald-600/5",
  },
  uncommon: {
    accent: "text-blue-400",
    border: "border-blue-500/25",
    bg: "from-blue-500/10 to-blue-600/5",
  },
  rare: {
    accent: "text-purple-400",
    border: "border-purple-500/25",
    bg: "from-purple-500/10 to-purple-600/5",
  },
  epic: {
    accent: "text-orange-400",
    border: "border-orange-500/25",
    bg: "from-orange-500/10 to-orange-600/5",
  },
  legendary: {
    accent: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "from-yellow-500/10 to-amber-500/5",
  },
  mythic: {
    accent: "text-red-400",
    border: "border-red-500/30",
    bg: "from-red-500/10 to-rose-500/5",
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
  const progress = Math.min((current / milestone) * 100, 100);

  return (
    <div
      className={cn(
        "relative rounded-2xl border overflow-hidden transition-all duration-300 animate-slide-up",
        unlocked ? config.border : "border-border/30",
        !unlocked && "opacity-50"
      )}
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        unlocked ? config.bg : "from-muted/10 to-muted/5"
      )} />

      <div className="relative p-4">
        {/* Top: rarity badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            "text-[8px] font-bold uppercase tracking-widest",
            unlocked ? config.accent : "text-muted-foreground/50"
          )}>
            {rarity}
          </span>
          {unlocked ? (
            <Check className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Lock className="w-3 h-3 text-muted-foreground/30" />
          )}
        </div>

        {/* Label */}
        <h4 className={cn(
          "font-bold text-sm mb-0.5",
          unlocked ? "text-foreground" : "text-muted-foreground"
        )}>
          {label}
        </h4>

        {/* Milestone */}
        <p className="text-[10px] text-muted-foreground mb-3 tabular-nums">
          {milestone.toLocaleString()} trees
        </p>

        {/* Progress bar */}
        {!unlocked && (
          <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/60 to-accent/60 transition-all duration-500"
              style={{ width: `${Math.max(progress, 2)}%` }}
            />
          </div>
        )}

        {unlocked && (
          <p className={cn("text-[10px] font-semibold", config.accent)}>
            Unlocked
          </p>
        )}
      </div>
    </div>
  );
};

export default NftCertificate;
