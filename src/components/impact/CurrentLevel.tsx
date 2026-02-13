import { TreePine, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Level {
  level: number;
  label: string;
  emoji: string;
  target: number;
}

const LEVELS: Level[] = [
  { level: 0, label: "Explorateur", emoji: "🌰", target: 0 },
  { level: 1, label: "Graine", emoji: "🌱", target: 10 },
  { level: 2, label: "Pousse", emoji: "🌿", target: 100 },
  { level: 3, label: "Racines", emoji: "🌾", target: 1_000 },
  { level: 4, label: "Canopée", emoji: "🌳", target: 10_000 },
  { level: 5, label: "Forêt", emoji: "🌲", target: 100_000 },
  { level: 6, label: "Légende", emoji: "🌍", target: 1_000_000 },
  { level: 7, label: "Infinity", emoji: "♾️", target: 10_000_000 },
];

interface CurrentLevelProps {
  treesPlanted: number;
}

const CurrentLevel = ({ treesPlanted }: CurrentLevelProps) => {
  // Find current level: last level whose target we've reached
  const currentLevel = [...LEVELS].reverse().find((l) => treesPlanted >= l.target) ?? LEVELS[0];
  const currentIdx = LEVELS.indexOf(currentLevel);
  const nextLevel = currentIdx < LEVELS.length - 1 ? LEVELS[currentIdx + 1] : null;

  const progress = nextLevel
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
          {/* Big avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
              <span className="text-4xl">
                {currentLevel.emoji}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg">
              {currentLevel.level}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
              Niveau actuel
            </p>
            <h3 className="text-xl font-bold text-foreground">
              {currentLevel.label}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text tabular-nums">
            {treesPlanted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: treesPlanted < 10 ? 2 : 0 })}
          </p>
          <p className="text-xs text-muted-foreground">arbres plantés</p>
        </div>
      </div>

      {/* Progress to next level */}
      {nextLevel && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Prochain : <span className="text-foreground font-semibold">{nextLevel.emoji} {nextLevel.label}</span>
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              {treesPlanted.toLocaleString()} / {nextLevel.target.toLocaleString()}
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
            {Math.round(progress)}% complété
          </p>
        </div>
      )}

      {allMaxed && (
        <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Statut Infinity atteint — ♾️
          </p>
        </div>
      )}

      {/* Compact arrow timeline */}
      <div className="flex items-center gap-0.5 overflow-x-auto pb-1 scrollbar-none">
        {LEVELS.map((lvl, i) => {
          const achieved = treesPlanted >= lvl.target;
          const isCurrent =
            currentLevel?.level === lvl.level ||
            (allMaxed && i === LEVELS.length - 1);

          return (
            <div key={lvl.level} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all text-xs whitespace-nowrap",
                  isCurrent
                    ? "bg-primary/20 border border-primary/40 text-foreground font-semibold"
                    : achieved
                      ? "text-muted-foreground/80"
                      : "text-muted-foreground/30"
                )}
              >
                <span className="text-sm">{lvl.emoji}</span>
                {isCurrent && <span>{lvl.label}</span>}
              </div>
              {i < LEVELS.length - 1 && (
                <ChevronRight className={cn("w-3 h-3 shrink-0 mx-0.5", achieved ? "text-primary/40" : "text-muted-foreground/20")} />
              )}
            </div>
          );
        })}
        <div className="flex items-center">
          <ChevronRight className="w-3 h-3 text-muted-foreground/20 shrink-0 mx-0.5" />
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs text-purple-400/30">
            <span className="text-sm">🔮</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentLevel;
