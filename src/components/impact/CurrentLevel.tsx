import { TreePine, ChevronRight } from "lucide-react";

interface Level {
  level: number;
  label: string;
  target: number;
}

const LEVELS: Level[] = [
  { level: 1, label: "Seedling", target: 10 },
  { level: 2, label: "Sapling", target: 100 },
  { level: 3, label: "Grove", target: 1_000 },
  { level: 4, label: "Forest", target: 10_000 },
  { level: 5, label: "Ecosystem", target: 100_000 },
  { level: 6, label: "Biome", target: 1_000_000 },
];

interface CurrentLevelProps {
  treesPlanted: number;
}

const CurrentLevel = ({ treesPlanted }: CurrentLevelProps) => {
  // Find current level
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

  return (
    <div className="swap-card p-6 animate-slide-up backdrop-blur-sm">
      {/* Current level header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
            <TreePine className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Current Level
            </p>
            <h3 className="text-xl font-bold text-foreground">
              {currentLevel
                ? `Lv.${currentLevel.level} ${currentLevel.label}`
                : allMaxed
                  ? `Lv.${LEVELS[LEVELS.length - 1].level} ${LEVELS[LEVELS.length - 1].label}`
                  : "Lv.0 Starter"}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
            {treesPlanted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-muted-foreground">trees planted</p>
        </div>
      </div>

      {/* Progress to next level */}
      {nextLevel && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Next: <span className="text-foreground font-semibold">Lv.{nextLevel.level} {nextLevel.label}</span>
            </span>
            <span className="text-muted-foreground font-mono text-xs">
              {nextLevel.target.toLocaleString()} trees
            </span>
          </div>
          <div className="h-3 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {allMaxed && (
        <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
          <p className="text-sm text-green-400 font-medium">
            🌍 Maximum level reached — legendary status!
          </p>
        </div>
      )}

      {/* Level roadmap — compact horizontal */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {LEVELS.map((lvl, i) => {
          const achieved = treesPlanted >= lvl.target;
          const isCurrent =
            currentLevel?.level === lvl.level ||
            (allMaxed && i === LEVELS.length - 1);

          return (
            <div key={lvl.level} className="flex items-center">
              <div
                className={`flex flex-col items-center min-w-[64px] px-2 py-2 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-green-500/15 border border-green-500/30"
                    : achieved
                      ? "opacity-60"
                      : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-1 ${
                    achieved
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {lvl.level}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                  {lvl.label}
                </span>
              </div>
              {i < LEVELS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
              )}
            </div>
          );
        })}

        {/* Secret levels hint */}
        <div className="flex items-center">
          <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
          <div className="flex flex-col items-center min-w-[64px] px-2 py-2 rounded-xl opacity-30">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mb-1 bg-purple-500/20 text-purple-400">
              ?
            </div>
            <span className="text-[10px] text-purple-400/60 font-medium">Secret</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentLevel;
