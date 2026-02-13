import { Sparkles } from "lucide-react";

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


      {allMaxed && (
        <div className="mt-5 p-3 rounded-xl bg-secondary/50 border border-border/30 text-center">
          <p className="text-sm text-foreground font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Max level reached
          </p>
        </div>
      )}

      <p className="mt-4 text-[11px] text-muted-foreground text-center">
        Each level unlocks a <span className="text-primary font-semibold">Proof of Impact NFT</span>
      </p>
    </div>
  );
};

export default CurrentLevel;
