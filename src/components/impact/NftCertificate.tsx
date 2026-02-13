import { useState } from "react";
import { Lock, Check, TreePine } from "lucide-react";
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
    bg: "linear-gradient(160deg, #1e3a5f 0%, #2a4a6f 30%, #1a2d4a 70%, #162540 100%)",
    textMain: "#c8ddf0",
    textSub: "rgba(160,195,230,0.7)",
    borderColor: "rgba(120,175,230,0.35)",
    embossLight: "rgba(180,215,255,0.12)",
    accentColor: "#5b9bd5",
    shimmer: false,
    holo: false,
  },
  uncommon: {
    bg: "linear-gradient(160deg, #0c1a33 0%, #152d55 30%, #1a3565 70%, #0d1b35 100%)",
    textMain: "#a0c4e8",
    textSub: "rgba(130,170,220,0.65)",
    borderColor: "rgba(90,150,220,0.35)",
    embossLight: "rgba(140,190,255,0.1)",
    accentColor: "#4a8cc7",
    shimmer: false,
    holo: false,
  },
  rare: {
    bg: "linear-gradient(160deg, #7a5e14 0%, #c49a28 20%, #d4aa3c 50%, #b8952a 80%, #8a6b18 100%)",
    textMain: "#fff8e1",
    textSub: "rgba(255,248,220,0.75)",
    borderColor: "rgba(212,170,60,0.6)",
    embossLight: "rgba(255,240,180,0.2)",
    accentColor: "#e8c44a",
    shimmer: true,
    holo: false,
  },
  epic: {
    bg: "linear-gradient(160deg, #808080 0%, #c8c8c8 20%, #e0e0e0 50%, #b0b0b0 80%, #888888 100%)",
    textMain: "#ffffff",
    textSub: "rgba(255,255,255,0.7)",
    borderColor: "rgba(255,255,255,0.4)",
    embossLight: "rgba(255,255,255,0.25)",
    accentColor: "#d0d0d0",
    shimmer: true,
    holo: false,
  },
  legendary: {
    bg: "linear-gradient(160deg, #111111 0%, #252525 30%, #1a1a1a 70%, #0a0a0a 100%)",
    textMain: "#e8e8e8",
    textSub: "rgba(220,220,220,0.6)",
    borderColor: "rgba(150,150,150,0.3)",
    embossLight: "rgba(255,255,255,0.06)",
    accentColor: "#999",
    shimmer: true,
    holo: false,
  },
  mythic: {
    bg: "linear-gradient(160deg, #0a0a0a 0%, #1a1a1a 30%, #111111 70%, #050505 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.6)",
    borderColor: "rgba(212,175,55,0.35)",
    embossLight: "rgba(255,215,0,0.08)",
    accentColor: "#d4af37",
    shimmer: true,
    holo: true,
  },
  infinity: {
    bg: "linear-gradient(160deg, #050505 0%, #111111 20%, #080808 60%, #000000 100%)",
    textMain: "#d4af37",
    textSub: "rgba(212,175,55,0.6)",
    borderColor: "rgba(212,175,55,0.4)",
    embossLight: "rgba(255,215,0,0.1)",
    accentColor: "#d4af37",
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

  const offsetX = index * 38;
  const rotation = (index - (total - 1) / 2) * 3;

  return (
    <div
      className="absolute top-0 left-0 transition-all duration-300 ease-out"
      style={{
        width: "140px",
        height: "220px",
        transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
        zIndex: flipped ? 30 : 10 + index,
        perspective: "800px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = `translateX(${offsetX}px) rotate(0deg) translateY(-24px) scale(1.12)`;
        el.style.zIndex = "25";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
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
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            background: unlocked ? config.bg : "linear-gradient(160deg, #1a1a1a, #222, #1a1a1a)",
            border: `1.5px solid ${unlocked ? config.borderColor : "rgba(80,80,80,0.15)"}`,
            boxShadow: unlocked
              ? `0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 ${config.embossLight}, inset 0 -1px 0 rgba(0,0,0,0.3)`
              : "0 4px 16px rgba(0,0,0,0.3)",
            opacity: unlocked ? 1 : 0.3,
            filter: unlocked ? "none" : "grayscale(70%) brightness(0.6)",
          }}
        >
          {/* Metallic texture */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 35% 15%, ${config.embossLight} 0%, transparent 60%), radial-gradient(ellipse at 65% 85%, rgba(0,0,0,0.2) 0%, transparent 55%)`,
          }} />

          {/* Shimmer */}
          {config.shimmer && unlocked && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute -inset-full w-[200%] h-[200%]"
                style={{
                  background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 58%, transparent 65%)",
                  animation: "card-shimmer 3s ease-in-out infinite",
                }}
              />
            </div>
          )}

          {/* Holo */}
          {config.holo && unlocked && (
            <div
              className="absolute inset-0 opacity-[0.08] mix-blend-screen"
              style={{
                background: "linear-gradient(135deg, #ff0000, #ff7700, #ffff00, #00ff00, #0077ff, #8800ff, #ff0088, #ff0000)",
                backgroundSize: "400% 400%",
                animation: "holo-shift 4s ease infinite",
              }}
            />
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-3.5">
            {/* Top: Logo + chip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <img src={leafIcon} alt="" className="w-4 h-4 rounded" style={{ opacity: unlocked ? 1 : 0.3 }} />
                <span className="text-[7px] font-bold tracking-tight" style={{ color: unlocked ? config.textMain : "#555" }}>
                  Reforest<span style={{ color: unlocked ? "#22c55e" : "#444" }}>Wallet</span>
                </span>
              </div>
              {unlocked && (
                <div className="w-6 h-4.5 rounded-sm" style={{
                  background: `linear-gradient(135deg, ${config.accentColor}33, ${config.accentColor}11)`,
                  border: `1px solid ${config.borderColor}`,
                }} />
              )}
            </div>

            {/* Decorative lines — "engraved" pattern */}
            <div className="flex-1 flex flex-col items-center justify-center gap-1">
              {/* Fine engraved lines */}
              <div className="w-full space-y-[3px] mb-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-full h-[0.5px]" style={{
                    background: unlocked
                      ? `linear-gradient(90deg, transparent, ${config.borderColor}, transparent)`
                      : "linear-gradient(90deg, transparent, rgba(60,60,60,0.3), transparent)",
                  }} />
                ))}
              </div>

              {/* Big embossed number */}
              <p className="text-[28px] font-black tabular-nums leading-none" style={{
                color: unlocked ? config.textMain : "#2a2a2a",
                letterSpacing: "0.05em",
                textShadow: unlocked
                  ? `0 2px 6px rgba(0,0,0,0.7), 0 -1px 0 ${config.embossLight}, 0 1px 0 rgba(0,0,0,0.5)`
                  : "none",
                fontFamily: "'Space Grotesk', monospace",
              }}>
                {milestone >= 1_000_000
                  ? `${(milestone / 1_000_000).toFixed(0)}M`
                  : milestone >= 1_000
                    ? `${(milestone / 1_000).toFixed(0)}K`
                    : milestone.toLocaleString()}
              </p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em]" style={{
                color: unlocked ? config.textSub : "#2a2a2a",
              }}>
                trees planted
              </p>

              {/* Fine engraved lines */}
              <div className="w-full space-y-[3px] mt-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-full h-[0.5px]" style={{
                    background: unlocked
                      ? `linear-gradient(90deg, transparent, ${config.borderColor}, transparent)`
                      : "linear-gradient(90deg, transparent, rgba(60,60,60,0.3), transparent)",
                  }} />
                ))}
              </div>
            </div>

            {/* Bottom: Label + status */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.12em]" style={{
                  color: unlocked ? config.textMain : "#2a2a2a",
                  textShadow: unlocked ? `0 1px 3px rgba(0,0,0,0.5)` : "none",
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
              <TreePine className="w-4 h-4" style={{ color: unlocked ? config.accentColor : "#2a2a2a", opacity: 0.6 }} />
            </div>
          </div>
        </div>

        {/* ===== BACK ===== */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: unlocked ? config.bg : "linear-gradient(160deg, #1a1a1a, #222, #1a1a1a)",
            border: `1.5px solid ${unlocked ? config.borderColor : "rgba(80,80,80,0.15)"}`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Magnetic stripe */}
          <div className="absolute top-[12%] left-0 right-0 h-[8%]" style={{ background: "rgba(0,0,0,0.7)" }} />

          <div className="relative h-full flex flex-col items-center justify-end gap-2 p-4 pb-5">
            {unlocked ? (
              <>
                <Check className="w-6 h-6" style={{ color: config.textMain }} />
                <p className="text-[12px] font-bold" style={{ color: config.textMain }}>Proof of Impact</p>
                <p className="text-[9px] text-center leading-relaxed" style={{ color: config.textSub }}>{description}</p>
                <div className="w-full mt-2 space-y-[3px]">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-full h-[0.5px]" style={{
                      background: `linear-gradient(90deg, transparent, ${config.borderColor}, transparent)`,
                    }} />
                  ))}
                </div>
                <p className="text-[7px] font-mono tracking-widest mt-1" style={{ color: config.textSub }}>
                  NFT • {milestone.toLocaleString()} TREES
                </p>
              </>
            ) : (
              <>
                <Lock className="w-6 h-6" style={{ color: "#444" }} />
                <p className="text-[12px] font-semibold" style={{ color: "#555" }}>Locked</p>
                <p className="text-[9px] text-center" style={{ color: "#444" }}>
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
