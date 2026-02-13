import { useState } from "react";
import { ChevronRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Level {
  level: number;
  label: string;
  emoji: string;
  target: number;
}

const LEVELS: Level[] = [
  { level: 1, label: "Explorer", emoji: "🧭", target: 1 },
  { level: 2, label: "Seed", emoji: "🌰", target: 100 },
  { level: 3, label: "Sprout", emoji: "🌱", target: 1_000 },
  { level: 4, label: "Roots", emoji: "🌿", target: 10_000 },
  { level: 5, label: "Canopy", emoji: "🌳", target: 100_000 },
  { level: 6, label: "Forest", emoji: "🏔️", target: 1_000_000 },
  { level: 7, label: "Legend", emoji: "⭐", target: 10_000_000 },
  { level: 8, label: "Infinity", emoji: "♾️", target: 100_000_000 },
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
  const currentEmoji = achievedLevel ? currentLevel.emoji : "🌍";
  const currentLabel = achievedLevel ? currentLevel.label : "Level 0";
  const currentLvlNum = achievedLevel ? currentLevel.level : 0;

  return (
    <div className="swap-card p-5 animate-slide-up backdrop-blur-sm">
      {/* Compact current level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            {currentEmoji}
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Level {currentLvlNum}</p>
            <h3 className="text-lg font-bold text-foreground leading-tight">{currentLabel}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold gradient-text tabular-nums">
            {treesPlanted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: treesPlanted < 10 ? 2 : 0 })}
          </p>
          <p className="text-[10px] text-muted-foreground">trees</p>
        </div>
      </div>

      {/* Progress bar */}
      {nextLevel && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">
              Next: <span className="text-foreground font-semibold">{nextLevel.emoji} {nextLevel.label}</span>
            </span>
            <span className="text-muted-foreground font-mono text-[10px]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-shimmer rounded-full" />
            </div>
          </div>
        </div>
      )}

      {allMaxed && (
        <div className="mt-4 p-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Infinity status reached — ♾️
          </p>
        </div>
      )}

      {/* NFT info */}
      <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/5 border border-accent/10">
        <span className="text-base">🏆</span>
        <p className="text-[11px] text-muted-foreground">
          Each level-up unlocks a unique <span className="text-foreground font-semibold">Proof of Impact NFT</span>
        </p>
      </div>

      {/* Explore button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-secondary/60 hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
      >
        Explore all levels
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded levels roadmap */}
      {expanded && (
        <div className="mt-3 space-y-1 animate-fade-in">
          {LEVELS.map((lvl, i) => {
            const achieved = treesPlanted >= lvl.target;
            const isCurrent = achievedLevel?.level === lvl.level;

            return (
              <div
                key={lvl.level}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl transition-all",
                  isCurrent
                    ? "bg-primary/10 border border-primary/20"
                    : achieved
                      ? "bg-secondary/40"
                      : "opacity-50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{lvl.emoji}</span>
                  <div>
                    <p className={cn("text-sm font-semibold", isCurrent ? "text-primary" : "text-foreground")}>
                      {lvl.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Lv.{lvl.level} — {lvl.target.toLocaleString()} {lvl.target === 1 ? "tree" : "trees"} · 🏆 NFT</p>
                  </div>
                </div>
                <div className="text-sm">
                  {achieved ? (
                    <span className="text-primary font-semibold">✓</span>
                  ) : (
                    <span className="text-muted-foreground/50">🔒</span>
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
