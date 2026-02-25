import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Share2, Download, X, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import leafIcon from "@/assets/leaf-icon.png";

const LEVELS = [
  { level: 1, target: 1 },
  { level: 2, target: 100 },
  { level: 3, target: 1_000 },
  { level: 4, target: 10_000 },
  { level: 5, target: 100_000 },
  { level: 6, target: 1_000_000 },
  { level: 7, target: 10_000_000 },
  { level: 8, target: 100_000_000 },
];

interface ShareImpactCardProps {
  treesPlanted: number;
  totalDonationsUsd: number;
  totalSwaps: number;
  co2Absorbed: number;
}

const SHARE_TEXT = (trees: number) =>
  `I planted ${trees.toLocaleString()} trees with ReforestWallet! 🌱`;
const SHARE_URL = "https://reforestmvp.lovable.app";

const ShareImpactCard = ({ treesPlanted, totalDonationsUsd, totalSwaps, co2Absorbed }: ShareImpactCardProps) => {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const achievedLevel = [...LEVELS].reverse().find((l) => treesPlanted >= l.target);
  const currentLvl = achievedLevel ? achievedLevel.level : 0;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const captureCard = useCallback(async () => {
    if (!cardRef.current) return null;
    return html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
      logging: false,
    });
  }, []);

  const handleDownload = useCallback(async () => {
    setGenerating(true);
    try {
      const canvas = await captureCard();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "my-reforest-impact.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setGenerating(false);
    }
  }, [captureCard]);

  const handleShareSocial = useCallback((platform: string) => {
    const text = encodeURIComponent(SHARE_TEXT(treesPlanted));
    const url = encodeURIComponent(SHARE_URL);
    const urls: Record<string, string> = {
      x: `https://x.com/intent/tweet?text=${text}&url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      discord: `https://discord.com/channels/@me`,
      instagram: `https://www.instagram.com/`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  }, [treesPlanted]);

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
      >
        <Share2 className="w-4 h-4" />
        Share my Impact
      </Button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col items-center bg-background overflow-y-auto" onClick={() => setOpen(false)}>
      <div className="w-full max-w-sm mx-auto px-4 py-6 space-y-6" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-foreground font-bold text-lg">Share my Impact</h2>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* The card — original style */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl aspect-[9/16]"
          style={{
            background: "linear-gradient(145deg, #0a1a0f 0%, #0d2818 30%, #122d1a 60%, #0a1a0f 100%)",
            padding: "2px",
          }}
        >
          <div
            className="relative rounded-[22px] p-6 overflow-hidden h-full flex flex-col justify-between"
            style={{
              background: "linear-gradient(160deg, #0c1f12 0%, #0f2a18 40%, #0a1a0f 100%)",
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-20"
              style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)" }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <img src={leafIcon} alt="Leaf icon" className="w-8 h-8 rounded-lg" />
                <div>
                  <p className="text-white text-sm font-bold tracking-tight">ReforestWallet</p>
                  <p className="text-emerald-400/70 text-[10px]">Proof of Impact</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <span className="text-emerald-400 text-xs font-bold">Level {currentLvl}</span>
              </div>
            </div>

            {/* Main stat */}
            <div className="text-center mb-6 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TreePine className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-4xl font-black text-white tracking-tight tabular-nums">
                {treesPlanted.toLocaleString(undefined, { maximumFractionDigits: treesPlanted < 10 ? 2 : 0 })}
              </p>
              <p className="text-emerald-400/80 text-sm font-medium mt-1">trees planted</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
              <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-white text-lg font-bold tabular-nums">${totalDonationsUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className="text-gray-400 text-[10px]">Donated</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-white text-lg font-bold tabular-nums">{totalSwaps.toLocaleString()}</p>
                <p className="text-gray-400 text-[10px]">Swaps</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-white text-lg font-bold tabular-nums">{Math.floor(co2Absorbed).toLocaleString()} kg</p>
                <p className="text-gray-400 text-[10px]">CO₂/year</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-400 text-[10px] mb-0.5">Swap green →</p>
                <p className="text-emerald-400 text-xs font-semibold">reforestmvp.lovable.app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social share buttons */}
        <div>
          <p className="text-muted-foreground text-xs text-center mb-3">Share on</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => handleShareSocial("x")}
              className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              title="X"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button
              onClick={() => handleShareSocial("telegram")}
              className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              title="Telegram"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </button>
            <button
              onClick={() => handleShareSocial("discord")}
              className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              title="Discord"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
            </button>
            <button
              onClick={() => handleShareSocial("instagram")}
              className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </button>
          </div>
        </div>

        {/* Download */}
        <Button
          onClick={handleDownload}
          disabled={generating}
          className="w-full gap-2"
          variant="outline"
        >
          <Download className="w-4 h-4" />
          {generating ? "Generating..." : "Download Image"}
        </Button>
      </div>
    </div>,
    document.body
  );
};

export default ShareImpactCard;
