import { Flame, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreaksAndBadges } from "@/hooks/useStreaksAndBadges";

const BADGE_DEFS = [
  { type: "streak_7", name: "7-Day Streak", desc: "Swapped 7 days in a row", icon: "🔥" },
  { type: "streak_30", name: "30-Day Streak", desc: "Swapped 30 days in a row", icon: "💎" },
  { type: "streak_100", name: "100-Day Streak", desc: "Swapped 100 days in a row", icon: "👑" },
  { type: "first_swap", name: "First Swap", desc: "Completed your first swap", icon: "🎯" },
  { type: "swaps_10", name: "10 Swaps", desc: "Completed 10 swaps", icon: "⚡" },
  { type: "swaps_100", name: "100 Swaps", desc: "Completed 100 swaps", icon: "🚀" },
];

const StreaksBadges = () => {
  const { currentStreak, longestStreak, badges, loading } = useStreaksAndBadges();

  const earnedTypes = new Set(badges.map(b => b.badge_type));

  return (
    <div className="swap-card p-5 animate-slide-up backdrop-blur-sm">
      {/* Streak counters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
          <Flame className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Streak</p>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            {loading ? "—" : `${currentStreak} day${currentStreak !== 1 ? "s" : ""}`}
          </h3>
        </div>
        <div className="ml-auto text-right">
          <p className="text-[10px] text-muted-foreground">Best</p>
          <p className="text-sm font-semibold text-foreground tabular-nums">
            {loading ? "—" : `${longestStreak}d`}
          </p>
        </div>
      </div>

      {/* Streak progress bar (toward 7-day) */}
      {currentStreak < 7 && (
        <div className="mb-5">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>Next badge at 7 days</span>
            <span className="tabular-nums">{currentStreak}/7</span>
          </div>
          <div className="h-2 bg-muted/40 rounded-full overflow-hidden border border-border/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${Math.min((currentStreak / 7) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Badges grid */}
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-3">Badges</p>
      <div className="grid grid-cols-3 gap-2">
        {BADGE_DEFS.map((def) => {
          const earned = earnedTypes.has(def.type);
          return (
            <div
              key={def.type}
              className={cn(
                "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all",
                earned
                  ? "bg-secondary/50 border-border/40"
                  : "bg-transparent border-border/20 opacity-35"
              )}
            >
              <span className="text-xl">{def.icon}</span>
              <p className={cn("text-[10px] font-medium leading-tight", earned ? "text-foreground" : "text-muted-foreground")}>
                {def.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreaksBadges;
