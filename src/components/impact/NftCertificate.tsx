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
  common: {
    bg: "linear-gradient(145deg, #2a3d5c 0%, #3b5278 30%, #2e4468 60%, #1e3250 100%)",
    textMain: "#c8ddf0",
    textSub: "rgba(160,200,240,0.6)",
    border: "rgba(100,170,240,0.25)",
    engrave: "0 1px 3px rgba(0,0,0,0.9), 0 -1px 0 rgba(180,220,255,0.12), inset 0 0 20px rgba(100,170,240,0.05)",
    shimmer: false,
    holo: false,
  },
  uncommon: {
    bg: "linear-gradient(145deg, #0c1a33 0%, #1a2f55 30%, #162a4d 60%, #0d1b35 100%)",
    textMain: "#9bbde0",
    textSub: "rgba(120,170,220,0.55)",
    border: "rgba(70,140,220,0.3)",
    engrave: "0 1px 3px rgba(0,0,0,0.9), 0 -1px 0 rgba(140,190,255,0.1), inset 0 0 20px rgba(70,140,220,0.05)",
    shimmer: false,
    holo: false,
  },
  rare: {
    bg: "linear-gradient(145deg, #6b4f0e 0%, #c49a28 25%, #d4aa3c 45%, #b8952a 70%, #7a5e14 100%)",
    textMain: "#fff8e1",
    textSub: "rgba(255,245,200,0.7)",
    border: "rgba(212,170,60,0.5)",
    engrave: "0 2px 6px rgba(0,0,0,0.7), 0 -1px 0 rgba(255,240,180,0.25), 0 0 12px rgba(212,170,60,0.15)",
    shimmer: true,
    holo: false,
  },
  epic: {
    bg: "linear-gradient(145deg, #707070 0%, #b0b0b0 25%, #d0d0d0 45%, #a0a0a0 70%, #808080 100%)",
    textMain: "#ffffff",
    textSub: "rgba(255,255,255,0.65)",
    border: "rgba(255,255,255,0.35)",
    engrave: "0 2px 6px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.3), 0 0 12px rgba(255,255,255,0.1)",
    shimmer: true,
    holo: false,
  },
  legendary: {
    bg: "linear-gradient(145deg, #0d0d0d 0%, #1c1c1c 30%, #252525 50%, #181818 75%, #0a0a0a 100%)",
    textMain: "#e0e0e0",
    textSub: "rgba(200,200,200,0.5)",
    border: "rgba(120,120,120,0.25)",
    engrave: "0 2px 6px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.08)",
    shimmer: true,
    holo: false,
  },
  mythic: {
    bg: "linear-gradient(145deg, #0a0a0a 0%, #151515 30%, #1a1a1a 50%, #0f0f0f 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.5)",
    border: "rgba(212,175,55,0.3)",
    engrave: "0 2px 6px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,215,0,0.1), 0 0 16px rgba(212,175,55,0.1)",
    shimmer: true,
    holo: true,
  },
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
          opacity: unlocked ? 1 : 0.25,
          filter: unlocked ? "none" : "grayscale(70%) brightness(0.5)",
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

          {/* Status badge */}
          <div className="absolute bottom-4">
            {unlocked ? (
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Owned</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" style={{ color: "#3a3a3a" }} />
                <span className="text-[8px] uppercase tracking-widest" style={{ color: "#3a3a3a" }}>Locked</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCertificate;
