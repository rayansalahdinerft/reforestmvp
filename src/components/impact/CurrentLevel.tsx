import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import explorerAvatar from "@/assets/levels/explorer.png";
import seedAvatar from "@/assets/levels/seed.png";
import sproutAvatar from "@/assets/levels/sprout.png";
import rootsAvatar from "@/assets/levels/roots.png";
import canopyAvatar from "@/assets/levels/canopy.png";
import forestAvatar from "@/assets/levels/forest.png";
import legendAvatar from "@/assets/levels/legend.png";
import infinityAvatar from "@/assets/levels/infinity.png";

interface Level {
  level: number;
  label: string;
  avatar: string;
  target: number;
}

const LEVELS: Level[] = [
  { level: 1, label: "Explorer", avatar: explorerAvatar, target: 10 },
  { level: 2, label: "Seed", avatar: seedAvatar, target: 100 },
  { level: 3, label: "Sprout", avatar: sproutAvatar, target: 1_000 },
  { level: 4, label: "Roots", avatar: rootsAvatar, target: 10_000 },
  { level: 5, label: "Canopy", avatar: canopyAvatar, target: 100_000 },
  { level: 6, label: "Forest", avatar: forestAvatar, target: 1_000_000 },
  { level: 7, label: "Legend", avatar: legendAvatar, target: 10_000_000 },
  { level: 8, label: "Infinity", avatar: infinityAvatar, target: 100_000_000 },
];

interface CurrentLevelProps {
  treesPlanted: number;
}

const CurrentLevel = ({ treesPlanted }: CurrentLevelProps) => {
  const achievedLevel = [...LEVELS].reverse().find((l) => treesPlanted >= l.target) ?? null;
  const currentLevel = achievedLevel ?? LEVELS[0];
  const currentIdx = LEVELS.indexOf(currentLevel);
  const nextLevel = achievedLevel
    ? (currentIdx < LEVELS.length - 1 ? LEVELS[currentIdx + 1] : null)
    : LEVELS[0]; // not yet reached first level → next is Explorer

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

  return (
    <div className="swap-card p-6 animate-slide-up backdrop-blur-sm">
      {/* Hero level display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-primary/20 shadow-lg">
              <img src={currentLevel.avatar} alt={currentLevel.label} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg">
              {currentLevel.level}
            </div>
          </div>
          <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
              {achievedLevel ? "Current Level" : "No Level Yet"}
            </p>
            <h3 className="text-xl font-bold text-foreground">
              {achievedLevel ? currentLevel.label : "—"}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text tabular-nums">
            {treesPlanted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: treesPlanted < 10 ? 2 : 0 })}
          </p>
          <p className="text-xs text-muted-foreground">trees planted</p>
        </div>
      </div>

      {/* Progress to next level */}
      {nextLevel && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {achievedLevel ? "Next" : "First level"}: <span className="text-foreground font-semibold">{nextLevel.label}</span>
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              {treesPlanted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} / {nextLevel.target.toLocaleString()}
            </span>
          </div>
          <div className="h-3 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer rounded-full" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-right">
            {Math.round(progress)}% completed
          </p>
        </div>
      )}

      {allMaxed && (
        <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Infinity status reached — ♾️
          </p>
        </div>
      )}

      {/* Compact arrow timeline */}
      <div className="flex items-center gap-0.5 overflow-x-auto pb-1 scrollbar-none">
        {LEVELS.map((lvl, i) => {
          const achieved = treesPlanted >= lvl.target;
          const isCurrent = currentLevel.level === lvl.level;

          return (
            <div key={lvl.level} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-1.5 py-1 rounded-full transition-all whitespace-nowrap",
                  isCurrent
                    ? "bg-primary/20 border border-primary/40"
                    : ""
                )}
              >
                <img
                  src={lvl.avatar}
                  alt={lvl.label}
                  className={cn(
                    "w-6 h-6 rounded-full object-cover",
                    !achieved && !isCurrent && "opacity-30 grayscale"
                  )}
                />
                {isCurrent && <span className="text-xs font-semibold text-foreground pr-1">{lvl.label}</span>}
              </div>
              {i < LEVELS.length - 1 && (
                <ChevronRight className={cn("w-3 h-3 shrink-0 mx-0.5", achieved ? "text-primary/40" : "text-muted-foreground/20")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrentLevel;
