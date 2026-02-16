import { Lock, Check, Award } from "lucide-react";
import leafIcon from "@/assets/leaf-icon.png";

// Card images
import forestSteelImg from "@/assets/nft-cards/forest-steel.png";
import verdantBronzeImg from "@/assets/nft-cards/verdant-bronze.png";
import emeraldSilverImg from "@/assets/nft-cards/emerald-silver.png";
import guardianGoldImg from "@/assets/nft-cards/guardian-gold.png";
import earthPlatinumImg from "@/assets/nft-cards/earth-platinum.png";
import gaiaBlackImg from "@/assets/nft-cards/gaia-black-edition.png";

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "infinity";
  featured?: boolean;
}

const rarityImages: Record<string, string> = {
  common: forestSteelImg,
  uncommon: forestSteelImg,
  rare: verdantBronzeImg,
  epic: emeraldSilverImg,
  legendary: guardianGoldImg,
  mythic: earthPlatinumImg,
  infinity: gaiaBlackImg,
};

const rarityBorderColor: Record<string, string> = {
  common: "rgba(160,174,192,0.4)",
  uncommon: "rgba(160,174,192,0.4)",
  rare: "rgba(205,127,50,0.5)",
  epic: "rgba(80,200,140,0.4)",
  legendary: "rgba(212,170,60,0.5)",
  mythic: "rgba(200,210,225,0.5)",
  infinity: "rgba(212,175,55,0.5)",
};

const rarityGlow: Record<string, string> = {
  common: "rgba(160,174,192,0.15)",
  uncommon: "rgba(160,174,192,0.15)",
  rare: "rgba(205,127,50,0.2)",
  epic: "rgba(80,200,140,0.2)",
  legendary: "rgba(212,170,60,0.25)",
  mythic: "rgba(200,210,225,0.2)",
  infinity: "rgba(212,175,55,0.3)",
};

function formatMilestone(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

const NftCertificate = ({ milestone, label, description, current, rarity, featured }: NftCertificateProps) => {
  const unlocked = current >= milestone;
  const progress = Math.min((current / milestone) * 100, 100);
  const cardImage = rarityImages[rarity];
  const border = rarityBorderColor[rarity];
  const glow = rarityGlow[rarity];

  const cardWidth = featured ? 260 : 180;
  const cardHeight = featured ? 370 : 280;

  return (
    <div
      className="flex-shrink-0"
      style={{ width: cardWidth, height: cardHeight, perspective: "900px" }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden group transition-transform duration-300 hover:scale-[1.03]"
        style={{
          border: `1.5px solid ${border}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3), 0 0 30px ${glow}`,
        }}
      >
        {/* Card image background */}
        <img
          src={cardImage}
          alt={label}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />


        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Card name */}
          <p
            className="font-black uppercase tracking-[0.15em] text-white mb-0.5"
            style={{
              fontSize: featured ? "14px" : "10px",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            {label}
          </p>

          {/* Milestone */}
          <p
            className="font-black text-white/90 leading-tight"
            style={{
              fontSize: featured ? "28px" : "20px",
              textShadow: "0 2px 10px rgba(0,0,0,0.7)",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            {formatMilestone(milestone)} <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60">trees</span>
          </p>

          {/* NFT Status */}
          <div className="mt-2.5 pt-2.5 border-t border-white/10">
            {unlocked ? (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Award className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">NFT Claimed</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-white/40" />
                    <span className="text-[8px] font-semibold text-white/40 uppercase tracking-wider">NFT Locked</span>
                  </div>
                  <span className="text-[8px] font-bold text-white/50">{progress > 0 && progress < 0.01 ? progress.toFixed(3) : progress < 1 ? progress.toFixed(2) : Math.floor(progress)}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${border}, white)`,
                      opacity: 0.7,
                    }}
                  />
                </div>
                <p className="text-[7px] text-white/30">
                  {current.toLocaleString()} / {formatMilestone(milestone)} trees
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCertificate;
