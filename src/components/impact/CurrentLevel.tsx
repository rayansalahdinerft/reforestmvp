import { useState } from "react";
import { Sparkles, ChevronRight, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Level {
  level: number;
  label: string;
  target: number;
  rarity: string;
  color: string;
  nftDesc: string;
}

const LEVELS: Level[] = [
  { level: 1, label: "Explorer", target: 1, rarity: "Starter", color: "text-stone-400", nftDesc: "You planted your first tree." },
  { level: 2, label: "Seed", target: 100, rarity: "Common", color: "text-emerald-400", nftDesc: "100 trees funded." },
  { level: 3, label: "Grove", target: 1_000, rarity: "Uncommon", color: "text-green-400", nftDesc: "1,000 trees — a grove is forming." },
  { level: 4, label: "Forest", target: 10_000, rarity: "Rare", color: "text-blue-400", nftDesc: "10,000 trees. A real forest." },
  { level: 5, label: "Jungle", target: 100_000, rarity: "Epic", color: "text-purple-400", nftDesc: "100K trees — an ecosystem thrives." },
  { level: 6, label: "Biome", target: 1_000_000, rarity: "Legendary", color: "text-orange-400", nftDesc: "1 million trees planted." },
  { level: 7, label: "Legend", target: 10_000_000, rarity: "Mythic", color: "text-yellow-400", nftDesc: "10M trees. Legendary status." },
  { level: 8, label: "Infinity", target: 100_000_000, rarity: "∞", color: "text-cyan-400", nftDesc: "100M trees. Eternal impact." },
];

interface CurrentLevelProps {
  treesPlanted: number;
}

const CurrentLevel = ({ treesPlanted }: CurrentLevelProps) => {
  const [expanded, setExpanded] = useState(false);

  const achievedLevel = [...LEVELS].reverse().find((l) => treesPlanted >= l.target) ?? null;
  const currentLevel = achievedLevel ?? LEVELS[0];
  const currentIdx = achievedLevel ? LEVELS.indexOf(currentLevel) : -1;
  const nextLevel = achievedLevel
    ? (currentIdx < LEVELS.length - 1 ? LEVELS[currentIdx + 1] : null)
    : LEVELS[0];

  const progress = !achievedLevel
    ? Math.min((treesPlanted / LEVELS[0].target) * 100, 100)
    : nextLevel
      ? Math.min(
          ((treesPlanted - currentLevel.target) /
            (nextLevel.target - currentLevel.target)) *
            100,
          100
        )
      : 100;

  const allMaxed = !nextLevel;
  const currentLabel = achievedLevel ? currentLevel.label : "Newcomer";
  const currentLvlNum = achievedLevel ? currentLevel.level : 0;

  return (
    <div className="swap-card p-5 animate-slide-up backdrop-blur-sm">
      {/* Current level header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Level {currentLvlNum}</p>
            {achievedLevel && (
              <span className={cn("text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-current/20", currentLevel.color)}>
                {currentLevel.rarity}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">{currentLabel}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text tabular-nums">
            {treesPlanted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: treesPlanted < 10 ? 2 : 0 })}
          </p>
          <p className="text-[10px] text-muted-foreground">trees planted</p>
        </div>
      </div>

      {/* Progress bar */}
      {nextLevel && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">
              Next: <span className="text-foreground font-semibold">{nextLevel.label}</span>
              <span className={cn("ml-1.5 text-[9px] font-bold uppercase", nextLevel.color)}>{nextLevel.rarity}</span>
            </span>
            <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden border border-border/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out relative"
              style={{ width: `${Math.max(progress, 2)}%` }}
            >
              <div className="absolute inset-0 animate-shimmer rounded-full" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 tabular-nums">
            {treesPlanted.toLocaleString(undefined, { maximumFractionDigits: 2 })} / {nextLevel.target.toLocaleString()} trees
          </p>
        </div>
      )}

      {allMaxed && (
        <div className="mt-5 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Max level reached
          </p>
        </div>
      )}

      {/* NFT info */}
      <p className="mt-4 text-[11px] text-muted-foreground text-center">
        Each level unlocks a <span className="text-primary font-semibold">Proof of Impact NFT</span>
      </p>

      {/* Explore toggle — small arrow */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? "Hide levels" : "All levels"}
        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200", expanded && "rotate-90")} />
      </button>

      {/* Expanded levels */}
      {expanded && (
        <div className="mt-2 space-y-px animate-fade-in">
          <TooltipProvider delayDuration={200}>
            {LEVELS.map((lvl) => {
              const achieved = treesPlanted >= lvl.target;
              const isCurrent = achievedLevel?.level === lvl.level;

              return (
                <Tooltip key={lvl.level}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg cursor-default",
                        isCurrent
                          ? "bg-secondary/50 border border-border/30"
                          : "bg-transparent",
                        !achieved && "opacity-35"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] text-muted-foreground font-mono w-4 text-center">{lvl.level}</span>
                        <p className={cn(
                          "text-sm font-medium",
                          achieved ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {lvl.label}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground tabular-nums">{lvl.target.toLocaleString()}</span>
                        {achieved ? (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Lock className="w-3 h-3 text-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[200px] p-2.5">
                    <p className="font-semibold text-xs mb-1">NFT — Lv.{lvl.level} {lvl.label}</p>
                    <p className="text-[11px] text-muted-foreground">{lvl.nftDesc}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default CurrentLevel;
