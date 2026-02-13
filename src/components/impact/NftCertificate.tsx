import { useState } from "react";
import { Lock, Check } from "lucide-react";
import leafIcon from "@/assets/leaf-icon.png";

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "infinity";
}

const rarityConfig = {
  common: {
    bg: "linear-gradient(160deg, #1e3a5f 0%, #2a4f78 40%, #1a2d4a 100%)",
    textMain: "#c8ddf0",
    textSub: "rgba(160,200,240,0.6)",
    border: "rgba(100,170,240,0.25)",
    engrave: "0 2px 4px rgba(0,0,0,0.8), 0 -1px 0 rgba(180,220,255,0.15)",
    lineColor: "rgba(100,170,240,0.15)",
    shimmer: false,
    holo: false,
  },
  uncommon: {
    bg: "linear-gradient(160deg, #0c1a33 0%, #162d55 40%, #0d1b35 100%)",
    textMain: "#9bbde0",
    textSub: "rgba(120,170,220,0.55)",
    border: "rgba(70,140,220,0.3)",
    engrave: "0 2px 4px rgba(0,0,0,0.9), 0 -1px 0 rgba(140,190,255,0.12)",
    lineColor: "rgba(70,140,220,0.15)",
    shimmer: false,
    holo: false,
  },
  rare: {
    bg: "linear-gradient(160deg, #6b4f0e 0%, #c49a28 25%, #d4aa3c 50%, #b8952a 75%, #7a5e14 100%)",
    textMain: "#fff8e1",
    textSub: "rgba(255,245,200,0.7)",
    border: "rgba(212,170,60,0.5)",
    engrave: "0 2px 6px rgba(0,0,0,0.7), 0 -1px 0 rgba(255,240,180,0.25), 0 0 12px rgba(212,170,60,0.15)",
    lineColor: "rgba(255,240,180,0.2)",
    shimmer: true,
    holo: false,
  },
  epic: {
    bg: "linear-gradient(160deg, #707070 0%, #b8b8b8 25%, #d8d8d8 50%, #a8a8a8 75%, #808080 100%)",
    textMain: "#ffffff",
    textSub: "rgba(255,255,255,0.65)",
    border: "rgba(255,255,255,0.35)",
    engrave: "0 2px 6px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.3), 0 0 12px rgba(255,255,255,0.1)",
    lineColor: "rgba(255,255,255,0.15)",
    shimmer: true,
    holo: false,
  },
  legendary: {
    bg: "linear-gradient(160deg, #0d0d0d 0%, #1f1f1f 30%, #2a2a2a 50%, #1a1a1a 75%, #0a0a0a 100%)",
    textMain: "#e0e0e0",
    textSub: "rgba(200,200,200,0.5)",
    border: "rgba(120,120,120,0.25)",
    engrave: "0 2px 6px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,255,255,0.08)",
    lineColor: "rgba(255,255,255,0.06)",
    shimmer: true,
    holo: false,
  },
  mythic: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #151515 30%, #1a1a1a 50%, #0f0f0f 75%, #050505 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.5)",
    border: "rgba(212,175,55,0.3)",
    engrave: "0 2px 6px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,215,0,0.1), 0 0 16px rgba(212,175,55,0.1)",
    lineColor: "rgba(212,175,55,0.12)",
    shimmer: true,
    holo: true,
  },
  infinity: {
    bg: "linear-gradient(160deg, #030303 0%, #0a0a0a 30%, #111111 50%, #080808 75%, #000000 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.55)",
    border: "rgba(212,175,55,0.4)",
    engrave: "0 2px 8px rgba(0,0,0,0.9), 0 -1px 0 rgba(255,215,0,0.15), 0 0 20px rgba(212,175,55,0.15)",
    lineColor: "rgba(212,175,55,0.15)",
    shimmer: true,
    holo: true,
  },
};

function formatMilestone(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

const NftCertificate = ({ milestone, label, description, current, rarity }: NftCertificateProps) => {
  const unlocked = current >= milestone;
  const c = rarityConfig[rarity];
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flex-shrink-0 snap-center"
      style={{ width: "200px", height: "310px", perspective: "900px" }}
    >
      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative cursor-pointer w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ===== FRONT ===== */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: unlocked ? c.bg : "linear-gradient(160deg, #1a1a1a, #222, #1a1a1a)",
            border: `1.5px solid ${unlocked ? c.border : "rgba(60,60,60,0.2)"}`,
            boxShadow: unlocked
              ? `0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 ${c.lineColor}`
              : "0 4px 16px rgba(0,0,0,0.3)",
            opacity: unlocked ? 1 : 0.3,
            filter: unlocked ? "none" : "grayscale(70%) brightness(0.5)",
          }}
        >
          {/* Shimmer sweep */}
          {c.shimmer && unlocked && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div
                className="absolute -inset-full w-[200%] h-[200%]"
                style={{
                  background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.12) 58%, transparent 70%)",
                  animation: "card-shimmer 3.5s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Holo */}
          {c.holo && unlocked && (
            <div
              className="absolute inset-0 opacity-[0.06] mix-blend-screen rounded-2xl"
              style={{
                background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
                backgroundSize: "400% 400%",
                animation: "holo-shift 4s ease infinite",
              }}
            />
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-between p-5 py-6">
            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <img src={leafIcon} alt="" className="w-5 h-5 rounded" style={{ opacity: unlocked ? 1 : 0.3 }} />
              <span className="text-[9px] font-bold tracking-tight" style={{ color: unlocked ? c.textMain : "#444" }}>
                Reforest<span style={{ color: unlocked ? "#22c55e" : "#333" }}>Wallet</span>
              </span>
            </div>

            {/* Decorative line */}
            <div className="w-3/4 h-[0.5px]" style={{ background: `linear-gradient(90deg, transparent, ${unlocked ? c.lineColor : "rgba(50,50,50,0.3)"}, transparent)` }} />

            {/* Engraved number */}
            <div className="text-center">
              <p
                className="font-black leading-none"
                style={{
                  fontSize: "42px",
                  color: unlocked ? c.textMain : "#222",
                  letterSpacing: "0.06em",
                  textShadow: unlocked ? c.engrave : "none",
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}
              >
                {formatMilestone(milestone)}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] mt-2" style={{ color: unlocked ? c.textSub : "#222" }}>
                trees planted
              </p>
            </div>

            {/* Decorative line */}
            <div className="w-3/4 h-[0.5px]" style={{ background: `linear-gradient(90deg, transparent, ${unlocked ? c.lineColor : "rgba(50,50,50,0.3)"}, transparent)` }} />

            {/* Label + status */}
            <div className="text-center">
              <p className="text-[13px] font-black uppercase tracking-[0.15em]" style={{
                color: unlocked ? c.textMain : "#222",
                textShadow: unlocked ? `0 1px 3px rgba(0,0,0,0.5)` : "none",
              }}>
                {label}
              </p>
              {unlocked ? (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Check className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Owned</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Lock className="w-3 h-3" style={{ color: "#3a3a3a" }} />
                  <span className="text-[8px] uppercase tracking-widest" style={{ color: "#3a3a3a" }}>Locked</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: unlocked ? c.bg : "linear-gradient(160deg, #1a1a1a, #222, #1a1a1a)",
            border: `1.5px solid ${unlocked ? c.border : "rgba(60,60,60,0.2)"}`,
            boxShadow: `0 16px 48px rgba(0,0,0,0.6)`,
          }}
        >
          <div className="relative h-full flex flex-col items-center justify-center gap-3 p-5">
            {unlocked ? (
              <>
                <img src={leafIcon} alt="" className="w-8 h-8 rounded-lg" />
                <p className="text-[14px] font-bold" style={{ color: c.textMain }}>Proof of Impact</p>
                <div className="w-2/3 h-[0.5px]" style={{ background: `linear-gradient(90deg, transparent, ${c.lineColor}, transparent)` }} />
                <p className="text-[10px] text-center leading-relaxed" style={{ color: c.textSub }}>{description}</p>
                <div className="w-2/3 h-[0.5px]" style={{ background: `linear-gradient(90deg, transparent, ${c.lineColor}, transparent)` }} />
                <p className="text-[8px] font-mono tracking-[0.2em] mt-1" style={{ color: c.textSub }}>
                  NFT #{formatMilestone(milestone)}
                </p>
              </>
            ) : (
              <>
                <Lock className="w-7 h-7" style={{ color: "#3a3a3a" }} />
                <p className="text-[13px] font-semibold" style={{ color: "#444" }}>Locked</p>
                <p className="text-[10px] text-center" style={{ color: "#3a3a3a" }}>
                  Plant {milestone.toLocaleString()} trees to unlock
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCertificate;
