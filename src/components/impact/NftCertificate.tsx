import { Lock, Check } from "lucide-react";
import leafIcon from "@/assets/leaf-icon.png";

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "infinity";
  featured?: boolean;
}

const rarityConfig = {
  // Forest Steel — brushed steel, robust
  common: {
    bg: "linear-gradient(145deg, #4a5568 0%, #718096 30%, #a0aec0 50%, #718096 70%, #4a5568 100%)",
    textMain: "#e2e8f0",
    textSub: "rgba(200,215,230,0.6)",
    border: "rgba(160,174,192,0.35)",
    engrave: "0 1px 3px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.15), inset 0 0 20px rgba(160,174,192,0.08)",
    shimmer: false,
    holo: false,
  },
  // Forest Steel — brushed steel
  uncommon: {
    bg: "linear-gradient(145deg, #4a5568 0%, #718096 30%, #a0aec0 50%, #718096 70%, #4a5568 100%)",
    textMain: "#e2e8f0",
    textSub: "rgba(200,215,230,0.6)",
    border: "rgba(160,174,192,0.35)",
    engrave: "0 1px 3px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.15), inset 0 0 20px rgba(160,174,192,0.08)",
    shimmer: false,
    holo: false,
  },
  // Verdant Bronze — bronze texturé
  rare: {
    bg: "linear-gradient(145deg, #5c3d1e 0%, #8b6914 25%, #cd7f32 45%, #a0682d 70%, #6b4226 100%)",
    textMain: "#f5e6c8",
    textSub: "rgba(245,230,200,0.65)",
    border: "rgba(205,127,50,0.45)",
    engrave: "0 2px 6px rgba(0,0,0,0.8), 0 -1px 0 rgba(245,230,200,0.2), 0 0 12px rgba(205,127,50,0.12)",
    shimmer: true,
    holo: false,
  },
  // Emerald Silver — argent poli + accents émeraude
  epic: {
    bg: "linear-gradient(145deg, #8a9bae 0%, #c0c8d0 25%, #dde3e8 45%, #b8c4d0 70%, #8a9bae 100%)",
    textMain: "#ffffff",
    textSub: "rgba(80,200,140,0.7)",
    border: "rgba(80,200,140,0.35)",
    engrave: "0 2px 6px rgba(0,0,0,0.5), 0 -1px 0 rgba(255,255,255,0.35), 0 0 16px rgba(80,200,140,0.1)",
    shimmer: true,
    holo: false,
  },
  // Guardian Gold — or mat, gravure profonde
  legendary: {
    bg: "linear-gradient(145deg, #6b4f0e 0%, #c49a28 25%, #d4aa3c 45%, #b8952a 70%, #7a5e14 100%)",
    textMain: "#fff8e1",
    textSub: "rgba(255,245,200,0.7)",
    border: "rgba(212,170,60,0.5)",
    engrave: "0 2px 8px rgba(0,0,0,0.8), 0 -1px 0 rgba(255,240,180,0.3), 0 0 14px rgba(212,170,60,0.2)",
    shimmer: true,
    holo: false,
  },
  // Earth Platinum — platine, reflets froids
  mythic: {
    bg: "linear-gradient(145deg, #c0c5ce 0%, #d8dce5 25%, #e8ecf0 45%, #d0d5de 70%, #b0b8c5 100%)",
    textMain: "#2d3748",
    textSub: "rgba(45,55,72,0.55)",
    border: "rgba(200,210,225,0.5)",
    engrave: "0 2px 6px rgba(0,0,0,0.3), 0 -1px 0 rgba(255,255,255,0.5), 0 0 16px rgba(200,210,225,0.15)",
    shimmer: true,
    holo: true,
  },
  // Gaia Black Edition — noir profond, gravure or/platine
  infinity: {
    bg: "linear-gradient(145deg, #030303 0%, #0a0a0a 30%, #111111 50%, #080808 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.55)",
    border: "rgba(212,175,55,0.4)",
    engrave: "0 2px 8px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,215,0,0.15), 0 0 20px rgba(212,175,55,0.15)",
    shimmer: true,
    holo: true,
  },
};

function formatMilestone(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

const NftCertificate = ({ milestone, label, description, current, rarity, featured }: NftCertificateProps) => {
  const unlocked = current >= milestone;
  const c = rarityConfig[rarity];

  const cardWidth = featured ? 240 : 170;
  const cardHeight = featured ? 340 : 260;

  return (
    <div
      className="flex-shrink-0"
      style={{ width: cardWidth, height: cardHeight, perspective: "900px" }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          background: unlocked ? c.bg : "linear-gradient(145deg, #1a1a1a, #222, #1a1a1a)",
          border: `1.5px solid ${unlocked ? c.border : "rgba(60,60,60,0.15)"}`,
          boxShadow: unlocked
            ? `0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)`
            : "0 4px 16px rgba(0,0,0,0.25)",
          opacity: unlocked ? 1 : 0.6,
          filter: unlocked ? "none" : "grayscale(40%) brightness(0.7)",
        }}
      >
        {/* Metal brushed texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
          }}
        />

        {/* Shimmer sweep */}
        {c.shimmer && unlocked && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div
              className="absolute -inset-full w-[200%] h-[200%]"
              style={{
                background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 42%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.1) 58%, transparent 70%)",
                animation: "card-shimmer 3.5s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {/* Holo */}
        {c.holo && unlocked && (
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-screen rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
              backgroundSize: "400% 400%",
              animation: "holo-shift 4s ease infinite",
            }}
          />
        )}

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-2 p-5">
          {/* Top logo */}
          <div className="flex items-center gap-1.5 absolute top-4">
            <img src={leafIcon} alt="" className="w-4 h-4 rounded" style={{ opacity: unlocked ? 0.7 : 0.2 }} />
            <span className="text-[8px] font-bold tracking-tight uppercase" style={{ color: unlocked ? c.textSub : "#333", letterSpacing: "0.15em" }}>
              Proof of Impact
            </span>
          </div>

          {/* Engraved label */}
          <p
            className="font-black uppercase tracking-[0.2em]"
            style={{
              fontSize: featured ? "15px" : "11px",
              color: unlocked ? c.textMain : "#222",
              textShadow: unlocked ? c.engrave : "none",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            {label}
          </p>

          {/* Engraved number */}
          <p
            className="font-black leading-none"
            style={{
              fontSize: featured ? "52px" : "36px",
              color: unlocked ? c.textMain : "#222",
              letterSpacing: "0.04em",
              textShadow: unlocked ? c.engrave : "none",
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
            }}
          >
            {formatMilestone(milestone)}
          </p>

          <p className="text-[9px] font-semibold uppercase tracking-[0.25em]" style={{ color: unlocked ? c.textSub : "#222" }}>
            trees planted
          </p>

          {/* Status badge + progress */}
          <div className="absolute bottom-4 w-full px-5">
            {unlocked ? (
              <div className="flex items-center justify-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Owned</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[7px] uppercase tracking-wider" style={{ color: "#555" }}>
                  <span>{current.toLocaleString()}</span>
                  <span>{formatMilestone(milestone)}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((current / milestone) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${c.textSub}, ${c.textMain})`,
                      opacity: 0.5,
                    }}
                  />
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Lock className="w-2.5 h-2.5" style={{ color: "#444" }} />
                  <span className="text-[7px] uppercase tracking-widest" style={{ color: "#444" }}>
                    {Math.floor((current / milestone) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCertificate;
