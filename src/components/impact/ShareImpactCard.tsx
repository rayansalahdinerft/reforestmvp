import { useState, useRef, useCallback } from "react";
import { Share2, Download, X, Leaf, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import qrcode from "qrcode-generator";
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

const generateQR = (url: string): string => {
  const qr = qrcode(0, "M");
  qr.addData(url);
  qr.make();
  return qr.createDataURL(4, 0);
};

const ShareImpactCard = ({ treesPlanted, totalDonationsUsd, totalSwaps, co2Absorbed }: ShareImpactCardProps) => {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const achievedLevel = [...LEVELS].reverse().find((l) => treesPlanted >= l.target);
  const currentLvl = achievedLevel ? achievedLevel.level : 0;

  const qrDataUrl = generateQR("https://reforestmvp.lovable.app");

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = "my-reforest-impact.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "my-reforest-impact.png", { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            title: "My Reforest Impact 🌱",
            text: `I planted ${treesPlanted.toLocaleString()} trees with ReforestWallet!`,
            files: [file],
          });
        } else {
          // Fallback to download
          const link = document.createElement("a");
          link.download = "my-reforest-impact.png";
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
        setGenerating(false);
      }, "image/png");
    } catch (err) {
      console.error("Failed to share:", err);
      setGenerating(false);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative max-w-sm w-full space-y-4">
        {/* Close */}
        <button
          onClick={() => setOpen(false)}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* The card to capture */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "linear-gradient(145deg, #0a1a0f 0%, #0d2818 30%, #122d1a 60%, #0a1a0f 100%)",
            padding: "2px",
          }}
        >
          {/* Inner card */}
          <div
            className="relative rounded-[22px] p-6 overflow-hidden"
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
                <img src={leafIcon} alt="" className="w-8 h-8 rounded-lg" />
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

            {/* QR + CTA */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-400 text-[10px] mb-0.5">Swap green →</p>
                <p className="text-emerald-400 text-xs font-semibold">reforestmvp.lovable.app</p>
              </div>
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white p-1">
                <img src={qrDataUrl} alt="QR Code" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleDownload}
            disabled={generating}
            className="flex-1 gap-2"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            {generating ? "Generating..." : "Download"}
          </Button>
          <Button
            onClick={handleShare}
            disabled={generating}
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Share2 className="w-4 h-4" />
            {generating ? "..." : "Share"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareImpactCard;
