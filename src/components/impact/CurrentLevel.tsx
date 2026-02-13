import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Level {
  level: number;
  label: string;
  emoji: string;
  target: number;
  rarity: string;
  color: string;
  glow: string;
  nftName: string;
  nftDesc: string;
}

const LEVELS: Level[] = [
  { level: 1, label: "Explorer", emoji: "🧭", target: 1, rarity: "Starter", color: "text-stone-400", glow: "from-stone-500/15 to-stone-600/5", nftName: "First Steps", nftDesc: "Your journey begins — proof you planted your very first tree." },
  { level: 2, label: "Seed", emoji: "🌰", target: 100, rarity: "Common", color: "text-emerald-400", glow: "from-emerald-500/15 to-emerald-600/5", nftName: "Seed Bearer", nftDesc: "100 trees funded. You carry the seeds of change." },
  { level: 3, label: "Sprout", emoji: "🌱", target: 1_000, rarity: "Uncommon", color: "text-green-400", glow: "from-green-500/15 to-green-600/5", nftName: "Green Sprout", nftDesc: "1,000 trees — your impact is visibly growing." },
  { level: 4, label: "Roots", emoji: "🌿", target: 10_000, rarity: "Rare", color: "text-blue-400", glow: "from-blue-500/15 to-blue-600/5", nftName: "Deep Roots", nftDesc: "10K trees planted. Your roots run deep in the ecosystem." },
  { level: 5, label: "Canopy", emoji: "🌳", target: 100_000, rarity: "Epic", color: "text-purple-400", glow: "from-purple-500/15 to-purple-600/5", nftName: "Canopy Guardian", nftDesc: "100K trees — you shelter entire ecosystems." },
  { level: 6, label: "Forest", emoji: "🏔️", target: 1_000_000, rarity: "Legendary", color: "text-orange-400", glow: "from-orange-500/15 to-orange-600/5", nftName: "Forest Keeper", nftDesc: "1M trees. You've created an entire forest." },
  { level: 7, label: "Legend", emoji: "⭐", target: 10_000_000, rarity: "Mythic", color: "text-yellow-400", glow: "from-yellow-500/15 to-yellow-600/5", nftName: "Living Legend", nftDesc: "10M trees — your name echoes through the canopy." },
  { level: 8, label: "Infinity", emoji: "♾️", target: 100_000_000, rarity: "∞", color: "text-cyan-400", glow: "from-cyan-500/15 to-cyan-600/5", nftName: "Infinite Impact", nftDesc: "100M trees. Beyond legendary — eternal impact." },
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
  const currentLabel = achievedLevel ? currentLevel.label : "Newcomer";
  const currentLvlNum = achievedLevel ? currentLevel.level : 0;

  return (
    <div className="swap-card p-5 animate-slide-up backdrop-blur-sm">
      {/* Compact current level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl shadow-lg shadow-primary/5">
            {currentEmoji}
          </div>
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
              Next: <span className="text-foreground font-semibold">{nextLevel.emoji} {nextLevel.label}</span>
              <span className={cn("ml-1.5 text-[9px] font-bold uppercase", nextLevel.color)}>{nextLevel.rarity}</span>
            </span>
            <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-muted/40 rounded-full overflow-hidden border border-border/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-accent transition-all duration-1000 ease-out relative"
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
            Infinity status reached — ♾️
          </p>
        </div>
      )}

      {/* NFT info */}
      <div className="mt-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
        <span className="text-lg">🏆</span>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Each level-up unlocks a unique <span className="text-primary font-semibold">Proof of Impact NFT</span>
        </p>
      </div>

      {/* Explore button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary/50 hover:bg-secondary/80 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all border border-border/30 hover:border-border/50"
      >
        {expanded ? "Hide levels" : "Explore all levels"}
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded levels roadmap */}
      {expanded && (
        <div className="mt-3 space-y-1.5 animate-fade-in">
        <TooltipProvider delayDuration={200}>
          {LEVELS.map((lvl) => {
            const achieved = treesPlanted >= lvl.target;
            const isCurrent = achievedLevel?.level === lvl.level;

            return (
              <Tooltip key={lvl.level}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center justify-between px-3.5 py-3 rounded-xl transition-all group cursor-pointer",
                      isCurrent
                        ? `bg-gradient-to-r ${lvl.glow} border border-primary/25 shadow-sm`
                        : achieved
                          ? "bg-secondary/30 border border-transparent hover:border-border/30"
                          : "border border-transparent opacity-40 hover:opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
                        isCurrent ? "bg-primary/15 shadow-sm" : achieved ? "bg-secondary/50" : "bg-muted/20"
                      )}>
                        {lvl.emoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={cn(
                            "text-sm font-bold",
                            isCurrent ? "text-foreground" : achieved ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {lvl.label}
                          </p>
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border border-current/15",
                            lvl.color
                          )}>
                            {lvl.rarity}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Lv.{lvl.level} — {lvl.target.toLocaleString()} {lvl.target === 1 ? "tree" : "trees"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-muted-foreground/60 hidden sm:inline">🏆 NFT</span>
                      {achieved ? (
                        <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-muted/20 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[220px] p-3">
                  <p className="font-bold text-sm mb-1">🏆 {lvl.nftName}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{lvl.nftDesc}</p>
                  <p className={cn("text-[10px] font-bold uppercase mt-2", achieved ? "text-primary" : "text-muted-foreground/50")}>
                    {achieved ? "✅ Unlocked" : "🔒 Locked"}
                  </p>
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
