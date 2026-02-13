import { useState, useRef } from "react";
import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import FloatingLeaves from "@/components/impact/FloatingLeaves";
import CurrentLevel from "@/components/impact/CurrentLevel";
import NftGallery from "@/components/impact/NftGallery";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useWalletStats } from "@/hooks/useWalletStats";
import { useAppKitAccount } from "@reown/appkit/react";
import { supabase } from "@/integrations/supabase/client";
import {
  Wallet, RefreshCw, Edit2, Check, X,
  DollarSign, Users, Leaf, Globe, Camera, Upload,
} from "lucide-react";
import { toast } from "sonner";

import explorerAvatar from "@/assets/levels/explorer.png";
import seedAvatar from "@/assets/levels/seed.png";
import sproutAvatar from "@/assets/levels/sprout.png";
import rootsAvatar from "@/assets/levels/roots.png";
import canopyAvatar from "@/assets/levels/canopy.png";
import forestAvatar from "@/assets/levels/forest.png";
import legendAvatar from "@/assets/levels/legend.png";
import infinityAvatar from "@/assets/levels/infinity.png";

const LEVELS = [
  { level: 1, label: "Explorer", avatar: explorerAvatar, target: 10 },
  { level: 2, label: "Seed", avatar: seedAvatar, target: 100 },
  { level: 3, label: "Sprout", avatar: sproutAvatar, target: 1_000 },
  { level: 4, label: "Roots", avatar: rootsAvatar, target: 10_000 },
  { level: 5, label: "Canopy", avatar: canopyAvatar, target: 100_000 },
  { level: 6, label: "Forest", avatar: forestAvatar, target: 1_000_000 },
  { level: 7, label: "Legend", avatar: legendAvatar, target: 10_000_000 },
  { level: 8, label: "Infinity", avatar: infinityAvatar, target: 100_000_000 },
];

const Portfolio = () => {
  const { balances, totalValue, loading, isConnected, address, refetch, priceError } = useWalletBalance();
  const { stats } = useWalletStats();
  const { address: appKitAddress } = useAppKitAccount();

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const treesPlanted = stats.totalTrees;
  const achievedLevel = [...LEVELS].reverse().find((l) => treesPlanted >= l.target) ?? null;
  const currentLevel = achievedLevel ?? LEVELS[0];

  const co2Absorbed = treesPlanted * 22;
  const oxygenProduced = treesPlanted * 100;
  const showEnv = treesPlanted >= 10;

  const profileAvatar = stats.avatarUrl || currentLevel.avatar;
  const shortAddr = appKitAddress ? `${appKitAddress.slice(0, 6)}...${appKitAddress.slice(-4)}` : "";

  const handleEditStart = () => {
    setNameInput(stats.displayName ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!appKitAddress) return;
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke("update-display-name", {
        body: { walletAddress: appKitAddress.toLowerCase(), displayName: nameInput.trim() || null },
      });
      if (error) throw error;
      toast.success("Display name updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !appKitAddress) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return; }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${appKitAddress.toLowerCase()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

      const { error } = await supabase.functions.invoke("update-display-name", {
        body: { walletAddress: appKitAddress.toLowerCase(), avatarUrl: urlData.publicUrl },
      });
      if (error) throw error;
      toast.success("Avatar updated! 🌱");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLeaves />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-lg text-muted-foreground">Your wallet, profile & impact in one place</p>
        </div>

        {!isConnected ? (
          <div className="swap-card p-8 text-center animate-slide-up">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Connect your wallet to view your portfolio and profile</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile card */}
            <div className="swap-card p-6 animate-slide-up backdrop-blur-sm">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden border border-primary/20 shadow-lg cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <img src={profileAvatar} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                      <Camera className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                  {achievedLevel && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg">
                      {currentLevel.level}
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  {uploadingAvatar && (
                    <div className="absolute inset-0 rounded-2xl bg-background/70 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Name & address */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {editing ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          placeholder="Enter display name"
                          className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-40"
                          maxLength={20}
                          autoFocus
                        />
                        <button onClick={handleSave} disabled={saving} className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold text-foreground truncate">{stats.displayName || shortAddr}</h2>
                        <button onClick={handleEditStart} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{shortAddr}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievedLevel ? `Level ${currentLevel.level} — ${currentLevel.label}` : "Level 0"}
                  </p>
                </div>

                {/* Trees */}
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold gradient-text tabular-nums">
                    {treesPlanted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: treesPlanted < 10 ? 2 : 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground">trees planted</p>
                </div>
              </div>
            </div>

            {/* Impact stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Leaf, value: treesPlanted, decimals: 2, label: "Trees Planted" },
                { icon: DollarSign, value: stats.totalDonationsUsd, prefix: "$", decimals: 2, label: "Total Donated" },
                { icon: Users, value: stats.totalSwaps, label: "Swaps Completed" },
                { icon: Globe, value: 0, label: "CO₂/Year", displayValue: showEnv ? `${Math.floor(co2Absorbed).toLocaleString()} kg` : "—" },
              ].map((card, i) => (
                <div key={card.label} className="swap-card p-4 animate-slide-up backdrop-blur-sm" style={{ animationDelay: `${i * 0.05}s` }}>
                  <card.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-lg font-bold text-foreground tabular-nums">
                    {card.displayValue ?? `${card.prefix ?? ""}${card.value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: card.decimals ?? 0 })}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Wallet balances */}
            <div className="swap-card p-6 animate-slide-up backdrop-blur-sm" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Wallet Value</p>
                  <h2 className="text-3xl font-bold text-foreground tabular-nums">
                    ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>
                <button onClick={refetch} className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-all" disabled={loading}>
                  <RefreshCw className={`w-5 h-5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
              {priceError && (
                <p className="text-yellow-500 text-xs mb-3">⚠️ Price data may be inaccurate</p>
              )}
              {balances.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No tokens found</p>
              ) : (
                <div className="space-y-2">
                  {balances.map((token) => (
                    <div key={token.symbol} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all">
                      <div className="flex items-center gap-3">
                        {token.logoURI && <img src={token.logoURI} alt={token.symbol} className="w-9 h-9 rounded-full" />}
                        <div>
                          <p className="font-semibold text-foreground text-sm">{token.symbol}</p>
                          <p className="text-xs text-muted-foreground">{token.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-sm tabular-nums">{token.balance}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">${token.balanceUsd.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Level progression */}
            <CurrentLevel treesPlanted={treesPlanted} />

            {/* Environmental detail */}
            {showEnv && (
              <div className="swap-card p-5 animate-slide-up backdrop-blur-sm" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Environmental Impact</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                    <p className="text-xl font-bold gradient-text">{Math.floor(co2Absorbed).toLocaleString()} kg</p>
                    <p className="text-xs text-muted-foreground mt-0.5">CO₂ absorbed/year</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/30">
                    <p className="text-xl font-bold gradient-text">{Math.floor(oxygenProduced).toLocaleString()} kg</p>
                    <p className="text-xs text-muted-foreground mt-0.5">O₂ produced/year</p>
                  </div>
                </div>
              </div>
            )}

            {/* NFT unlock reveal only (no visible card) */}
            <NftGallery treesPlanted={treesPlanted} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
