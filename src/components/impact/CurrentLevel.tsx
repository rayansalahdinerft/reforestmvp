import { TreePine, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Level {
  level: number;
  label: string;
  emoji: string;
  target: number;
}

const LEVELS: Level[] = [
  { level: 1, label: "Graine", emoji: "🌱", target: 10 },
  { level: 2, label: "Pousse", emoji: "🌿", target: 100 },
  { level: 3, label: "Racines", emoji: "🌾", target: 1_000 },
  { level: 4, label: "Canopée", emoji: "🌳", target: 10_000 },
  { level: 5, label: "Forêt", emoji: "🌲", target: 100_000 },
  { level: 6, label: "Biosphère", emoji: "🌍", target: 1_000_000 },
  { level: 7, label: "Légende", emoji: "⭐", target: 10_000_000 },
];

interface CurrentLevelProps {
  treesPlanted: number;
}

const CurrentLevel = ({ treesPlanted }: CurrentLevelProps) => {
  const currentLevelIndex = LEVELS.findIndex((l) => treesPlanted < l.target);
  const currentLevel =
    currentLevelIndex === -1
      ? LEVELS[LEVELS.length - 1]
      : currentLevelIndex === 0
        ? null
        : LEVELS[currentLevelIndex - 1];
  const nextLevel =
    currentLevelIndex === -1 ? null : LEVELS[currentLevelIndex];

  const progress = nextLevel
    ? Math.min(
        ((treesPlanted - (currentLevel?.target ?? 0)) /
          (nextLevel.target - (currentLevel?.target ?? 0))) *
          100,
        100
      )
    : 100;

  const allMaxed = currentLevelIndex === -1;

  const displayLevel = currentLevel ?? (allMaxed ? LEVELS[LEVELS.length - 1] : null);

  return (
    <div className="swap-card p-6 animate-slide-up backdrop-blur-sm">
      {/* Hero level display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Big emoji badge */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
              <span className="text-3xl">
                {displayLevel?.emoji ?? "🌰"}
              </span>
            </div>
            {displayLevel && (
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg">
                {displayLevel.level}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
              Niveau actuel
            </p>
            <h3 className="text-xl font-bold text-foreground">
              {displayLevel
                ? displayLevel.label
                : "Explorateur"}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text tabular-nums">
            {treesPlanted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
            Niveau maximum atteint — Statut Légendaire !
          </p>
        </div>
      )}

      {/* Level roadmap */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {LEVELS.map((lvl, i) => {
          const achieved = treesPlanted >= lvl.target;
          const isCurrent =
            currentLevel?.level === lvl.level ||
            (allMaxed && i === LEVELS.length - 1);

          return (
            <div key={lvl.level} className="flex items-center">
              <div
                className={cn(
                  "flex flex-col items-center min-w-[60px] px-2 py-2 rounded-xl transition-all",
                  isCurrent
                    ? "bg-primary/15 border border-primary/30 scale-105"
                    : achieved
                      ? "opacity-70"
                      : "opacity-30"
                )}
              >
                <span className="text-lg mb-0.5">{lvl.emoji}</span>
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold mb-0.5",
                    achieved
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {lvl.level}
                </div>
                <span className="text-[9px] text-muted-foreground font-medium whitespace-nowrap">
                  {lvl.label}
                </span>
              </div>
              {i < LEVELS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
              )}
            </div>
          );
        })}

        {/* Secret level hint */}
        <div className="flex items-center">
          <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
          <div className="flex flex-col items-center min-w-[60px] px-2 py-2 rounded-xl opacity-25">
            <span className="text-lg mb-0.5">🔮</span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold mb-0.5 bg-purple-500/20 text-purple-400">
              ?
            </div>
            <span className="text-[9px] text-purple-400/60 font-medium">Secret</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentLevel;
