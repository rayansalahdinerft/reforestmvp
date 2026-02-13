import { useState } from "react";
import { Lock, Check, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import leafIcon from "@/assets/leaf-icon.png";

interface NftCertificateProps {
  milestone: number;
  label: string;
  description: string;
  current: number;
  index: number;
  total: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "infinity";
}

const rarityConfig = {
  common: {
    // 1K — Bleu basique
    bg: "linear-gradient(145deg, #1e3a5f 0%, #1a2d4a 40%, #162540 100%)",
    textMain: "#a3c4e8",
    textSub: "rgba(130,170,220,0.6)",
    borderColor: "rgba(100,160,220,0.25)",
    embossLight: "rgba(150,200,255,0.08)",
    shimmer: false,
    holo: false,
  },
  uncommon: {
    // 10K — Bleu foncé
    bg: "linear-gradient(145deg, #0f2240 0%, #162d55 40%, #0d1b35 100%)",
    textMain: "#7da8d4",
    textSub: "rgba(100,150,200,0.5)",
    borderColor: "rgba(80,140,210,0.3)",
    embossLight: "rgba(120,180,255,0.06)",
    shimmer: false,
    holo: false,
  },
  rare: {
    // 100K — OR
    bg: "linear-gradient(145deg, #b8952a 0%, #d4aa3c 30%, #c49a28 60%, #a07820 100%)",
    textMain: "#fff8e1",
    textSub: "rgba(255,248,220,0.7)",
    borderColor: "rgba(212,170,60,0.5)",
    embossLight: "rgba(255,240,180,0.15)",
    shimmer: true,
    holo: false,
  },
  epic: {
    // 1M — Platine/Argent
    bg: "linear-gradient(145deg, #a0a0a0 0%, #d0d0d0 30%, #b8b8b8 60%, #909090 100%)",
    textMain: "#ffffff",
    textSub: "rgba(255,255,255,0.65)",
    borderColor: "rgba(255,255,255,0.35)",
    embossLight: "rgba(255,255,255,0.2)",
    shimmer: true,
    holo: false,
  },
  legendary: {
    // 10M — Noir premium
    bg: "linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 30%, #1f1f1f 60%, #111111 100%)",
    textMain: "#e0e0e0",
    textSub: "rgba(200,200,200,0.5)",
    borderColor: "rgba(120,120,120,0.3)",
    embossLight: "rgba(255,255,255,0.04)",
    shimmer: true,
    holo: false,
  },
  mythic: {
    // alias — same as legendary for 6-card scheme
    bg: "linear-gradient(145deg, #0d0d0d 0%, #1a1a1a 30%, #0f0f0f 60%, #080808 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.5)",
    borderColor: "rgba(212,175,55,0.3)",
    embossLight: "rgba(255,215,0,0.06)",
    shimmer: true,
    holo: true,
  },
  infinity: {
    // 100M — Noir absolu + or
    bg: "linear-gradient(145deg, #050505 0%, #111111 30%, #0a0a0a 60%, #000000 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.5)",
    borderColor: "rgba(212,175,55,0.35)",
    embossLight: "rgba(255,215,0,0.08)",
    shimmer: true,
    holo: true,
  },
};

const NftCertificate = ({
  milestone,
  label,
  description,
  current,
  index,
  total,
  rarity,
}: NftCertificateProps) => {
  const unlocked = current >= milestone;
  const config = rarityConfig[rarity];
  const [flipped, setFlipped] = useState(false);

  const offsetX = index * 52;
  const rotation = (index - (total - 1) / 2) * 2.5;

  return (
    <div
      className="absolute top-0 left-0 transition-all duration-300 ease-out"
      style={{
        width: "210px",
        aspectRatio: "85.6 / 53.98",
        transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
        zIndex: flipped ? 30 : 10 + index,
        perspective: "800px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = `translateX(${offsetX}px) rotate(0deg) translateY(-18px) scale(1.08)`;
        el.style.zIndex = "25";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = `translateX(${offsetX}px) rotate(${rotation}deg)`;
        el.style.zIndex = `${flipped ? 30 : 10 + index}`;
      }}
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
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: unlocked ? config.bg : "linear-gradient(145deg, #1a1a1a, #222, #1a1a1a)",
            border: `1.5px solid ${unlocked ? config.borderColor : "rgba(80,80,80,0.2)"}`,
            boxShadow: unlocked
              ? `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${config.embossLight}`
              : "0 4px 16px rgba(0,0,0,0.3)",
            opacity: unlocked ? 1 : 0.35,
            filter: unlocked ? "none" : "grayscale(60%) brightness(0.7)",
          }}
        >
          {/* Subtle metallic texture */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 30% 20%, ${config.embossLight} 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,0,0,0.15) 0%, transparent 50%)`,
          }} />

          {/* Shimmer sweep */}
          {config.shimmer && unlocked && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute -inset-full w-[200%]"
                style={{
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)",
                  animation: "card-shimmer 3s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Holo rainbow for mythic/infinity */}
          {config.holo && unlocked && (
            <div
              className="absolute inset-0 opacity-10 mix-blend-screen"
              style={{
                background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
                backgroundSize: "400% 400%",
                animation: "holo-shift 4s ease infinite",
              }}
            />
          )}

          {/* === Card content === */}
          <div className="relative h-full flex flex-col justify-between p-3.5">
            {/* Top: Logo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <img src={leafIcon} alt="" className="w-5 h-5 rounded" style={{ opacity: unlocked ? 1 : 0.3 }} />
                <span className="text-[8px] font-bold tracking-tight" style={{ color: unlocked ? config.textMain : "#555" }}>
                  Reforest<span style={{ color: unlocked ? "#22c55e" : "#444" }}>Wallet</span>
                </span>
              </div>
              {/* Chip */}
              {unlocked && (
                <div className="w-7 h-5 rounded-sm" style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
                  border: `1px solid ${config.borderColor}`,
                }}>
                  <div className="w-full h-full rounded-sm" style={{
                    background: "linear-gradient(135deg, rgba(200,180,100,0.2), rgba(200,180,100,0.05))",
                  }} />
                </div>
              )}
            </div>

            {/* Center: Embossed tree count */}
            <div>
              <p className="text-[22px] font-bold tabular-nums" style={{
                color: unlocked ? config.textMain : "#333",
                letterSpacing: "0.1em",
                textShadow: unlocked
                  ? `0 2px 4px rgba(0,0,0,0.5), 0 -1px 0 ${config.embossLight}`
                  : "none",
                fontFamily: "'Space Grotesk', monospace",
              }}>
                {milestone.toLocaleString()}
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] mt-0.5" style={{
                color: unlocked ? config.textSub : "#333",
              }}>
                trees planted
              </p>
            </div>

            {/* Bottom: Label + status */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em]" style={{
                  color: unlocked ? config.textMain : "#333",
                  textShadow: unlocked ? `0 1px 2px rgba(0,0,0,0.4)` : "none",
                }}>
                  {label}
                </p>
                {unlocked ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Check className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[7px] font-bold text-primary uppercase tracking-wider">Owned</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Lock className="w-2.5 h-2.5" style={{ color: "#444" }} />
                    <span className="text-[7px] uppercase tracking-wider" style={{ color: "#444" }}>Locked</span>
                  </div>
                )}
              </div>
              <TreePine className="w-4 h-4" style={{ color: unlocked ? config.textSub : "#333", opacity: 0.5 }} />
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: unlocked ? config.bg : "linear-gradient(145deg, #1a1a1a, #222, #1a1a1a)",
            border: `1.5px solid ${unlocked ? config.borderColor : "rgba(80,80,80,0.2)"}`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
          }}
        >
          {/* Magnetic stripe */}
          <div className="absolute top-[16%] left-0 right-0 h-[12%]" style={{ background: "rgba(0,0,0,0.6)" }} />

          <div className="relative h-full flex flex-col items-center justify-end gap-1.5 p-3 pb-4">
            {unlocked ? (
              <>
                <Check className="w-5 h-5" style={{ color: config.textMain }} />
                <p className="text-[11px] font-bold" style={{ color: config.textMain }}>Proof of Impact</p>
                <p className="text-[8px] text-center" style={{ color: config.textSub }}>{description}</p>
                <p className="text-[7px] font-mono tracking-widest mt-1" style={{ color: config.textSub }}>
                  NFT • {milestone.toLocaleString()} TREES
                </p>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" style={{ color: "#444" }} />
                <p className="text-[11px] font-semibold" style={{ color: "#555" }}>Locked</p>
                <p className="text-[8px] text-center" style={{ color: "#444" }}>
                  Plant {milestone.toLocaleString()} trees
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
