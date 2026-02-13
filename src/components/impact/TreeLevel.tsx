import { useEffect, useState } from "react";
import { TreePine, Check } from "lucide-react";

interface TreeLevelProps {
  level: number;
  label: string;
  target: number;
  current: number;
  onAchieve?: () => void;
  hidden?: boolean;
}

const TreeLevel = ({ level, label, target, current, onAchieve, hidden = false }: TreeLevelProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [hasTriggeredAchieve, setHasTriggeredAchieve] = useState(false);
  
  const achieved = current >= target;
  const progress = Math.min((current / target) * 100, 100);

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300 + level * 100);

    return () => clearTimeout(timer);
  }, [progress, level]);

  useEffect(() => {
    // Trigger confetti when level is achieved
    if (achieved && !hasTriggeredAchieve && onAchieve) {
      setHasTriggeredAchieve(true);
      onAchieve();
    }
  }, [achieved, hasTriggeredAchieve, onAchieve]);

  const isSecret = hidden && !achieved;

  return (
    <div
      className={`group relative p-5 rounded-2xl border transition-all duration-500 ${
        achieved
          ? "bg-gradient-to-r from-green-500/15 to-emerald-500/10 border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.15)]"
          : isSecret
            ? "bg-gradient-to-r from-purple-500/5 to-violet-500/5 border-purple-500/20 opacity-60"
            : "bg-card/50 border-border hover:border-border/80"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Level badge */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              achieved
                ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                : isSecret
                  ? "bg-purple-500/20"
                  : "bg-muted"
            }`}
          >
            {achieved ? (
              <Check className="w-5 h-5 text-white" />
            ) : isSecret ? (
              <span className="text-sm font-bold text-purple-400">?</span>
            ) : (
              <span className="text-sm font-bold text-muted-foreground">{level}</span>
            )}
          </div>
          
          {/* Level name */}
          <div>
            <span className={`text-sm font-semibold ${achieved ? "text-green-400" : isSecret ? "text-purple-400/70" : "text-foreground"}`}>
              {isSecret ? "???" : label}
            </span>
            <p className="text-xs text-muted-foreground">
              {isSecret ? "Secret Level" : `Level ${level}`}
            </p>
          </div>
        </div>

        {/* Target */}
        <div className="flex items-center gap-2">
          <TreePine className={`w-4 h-4 ${achieved ? "text-green-400" : isSecret ? "text-purple-400/50" : "text-muted-foreground"}`} />
          <span className={`text-sm font-bold ${achieved ? "text-green-400" : isSecret ? "text-purple-400/50" : "text-foreground"}`}>
            {isSecret ? "???" : target.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-muted/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            achieved
              ? "bg-gradient-to-r from-green-500 to-emerald-400"
              : isSecret
                ? "bg-gradient-to-r from-purple-500/40 to-violet-500/30"
                : "bg-gradient-to-r from-primary/80 to-primary/60"
          }`}
          style={{ width: `${isSecret ? 0 : animatedProgress}%` }}
        />
      </div>

      {/* Progress text */}
      <p className="text-xs text-muted-foreground mt-2 text-right">
        {isSecret ? "? / ???" : `${Math.min(current, target).toLocaleString()} / ${target.toLocaleString()}`}
      </p>
    </div>
  );
};

export default TreeLevel;
