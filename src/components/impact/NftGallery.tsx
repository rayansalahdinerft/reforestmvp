import { Lock, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Certificate {
  milestone: number;
  label: string;
  emoji: string;
  rarity: string;
  color: string;
  gradient: string;
  badgeBg: string;
}

const CERTIFICATES: Certificate[] = [
  { milestone: 10, label: "First Seedling", emoji: "🌱", rarity: "Common", color: "green", gradient: "from-green-400 to-emerald-500", badgeBg: "bg-green-500/20 text-green-400" },
  { milestone: 100, label: "Growing Roots", emoji: "🌿", rarity: "Uncommon", color: "blue", gradient: "from-blue-400 to-cyan-500", badgeBg: "bg-blue-500/20 text-blue-400" },
  { milestone: 1_000, label: "Forest Guardian", emoji: "🌳", rarity: "Rare", color: "purple", gradient: "from-purple-400 to-violet-500", badgeBg: "bg-purple-500/20 text-purple-400" },
  { milestone: 10_000, label: "Ecosystem Builder", emoji: "🏔️", rarity: "Epic", color: "orange", gradient: "from-orange-400 to-amber-500", badgeBg: "bg-orange-500/20 text-orange-400" },
  { milestone: 100_000, label: "Planet Protector", emoji: "🌍", rarity: "Legendary", color: "yellow", gradient: "from-yellow-400 to-amber-400", badgeBg: "bg-yellow-500/20 text-yellow-400" },
  { milestone: 1_000_000, label: "Mythic Reforester", emoji: "✨", rarity: "Mythic", color: "red", gradient: "from-red-400 to-rose-500", badgeBg: "bg-red-500/20 text-red-400" },
];

interface NftGalleryProps {
  treesPlanted: number;
}

const NftGallery = ({ treesPlanted }: NftGalleryProps) => {
  // Split into unlocked and locked
  const unlocked = CERTIFICATES.filter((c) => treesPlanted >= c.milestone);
  const locked = CERTIFICATES.filter((c) => treesPlanted < c.milestone);

  return (
    <div className="swap-card p-6 animate-slide-up backdrop-blur-sm" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-violet-500/10 flex items-center justify-center">
          <Award className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Proof-of-Impact</h3>
          <p className="text-sm text-muted-foreground">
            {unlocked.length}/{CERTIFICATES.length} certificates unlocked
          </p>
        </div>
      </div>

      {/* Unlocked certificates */}
      {unlocked.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {unlocked.map((cert) => (
            <div
              key={cert.milestone}
              className="group relative p-4 rounded-2xl border border-border/60 bg-card/50 overflow-hidden hover:scale-[1.02] transition-transform"
            >
              {/* Subtle shimmer */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />
              </div>

              <div className="relative flex flex-col items-center text-center gap-2">
                <span className="text-3xl">{cert.emoji}</span>
                <h4 className={cn("text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r", cert.gradient)}>
                  {cert.label}
                </h4>
                <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full", cert.badgeBg)}>
                  {cert.rarity}
                </span>
                <p className="text-[10px] text-muted-foreground">
                  {cert.milestone.toLocaleString()} trees
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked certificates — compact row */}
      {locked.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {locked.map((cert) => (
            <div
              key={cert.milestone}
              className="flex items-center gap-2 min-w-fit px-3 py-2 rounded-xl border border-border/30 bg-muted/20 opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground whitespace-nowrap">{cert.label}</p>
                <p className="text-[10px] text-muted-foreground/60">{cert.milestone.toLocaleString()} trees</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NftGallery;
