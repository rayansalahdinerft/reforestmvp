import { useState } from "react";
import { Sparkles, ChevronRight, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = [
  { level: 1, target: 1 },
  { level: 2, target: 100 },
  { level: 3, target: 1_000 },
  { level: 4, target: 10_000 },
  { level: 5, target: 100_000 },
  { level: 6, target: 1_000_000 },
  { level: 7, target: 10_000_000 },
  { level: 8, target: 100_000_000 },
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
  const currentLvlNum = achievedLevel ? currentLevel.level : 0;

  return (
    <div className="swap-card p-5 animate-slide-up backdrop-blur-sm">
      {/* Current level header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Current</p>
          <h3 className="text-xl font-bold text-foreground leading-tight">Level {currentLvlNum}</h3>
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
              Next: <span className="text-foreground font-semibold">Level {nextLevel.level}</span>
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
        <div className="mt-5 p-3 rounded-xl bg-secondary/50 border border-border/30 text-center">
          <p className="text-sm text-foreground font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Max level reached
          </p>
        </div>
      )}

      {/* NFT info */}
      <p className="mt-4 text-[11px] text-muted-foreground text-center">
        Each level unlocks a <span className="text-primary font-semibold">Proof of Impact NFT</span>
      </p>

      {/* Explore toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? "Hide" : "All levels"}
        <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200", expanded && "rotate-90")} />
      </button>

      {/* Expanded levels */}
      {expanded && (
        <div className="mt-2 space-y-px animate-fade-in">
          {LEVELS.map((lvl) => {
            const achieved = treesPlanted >= lvl.target;
            const isCurrent = achievedLevel?.level === lvl.level;

            return (
              <div
                key={lvl.level}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg",
                  isCurrent ? "bg-secondary/50 border border-border/30" : "bg-transparent",
                  !achieved && "opacity-35"
                )}
              >
                <span className={cn(
                  "text-sm font-medium",
                  achieved ? "text-foreground" : "text-muted-foreground"
                )}>
                  Level {lvl.level}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground tabular-nums">{lvl.target.toLocaleString()}</span>
                  {achieved ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Lock className="w-3 h-3 text-muted-foreground/30" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrentLevel;
