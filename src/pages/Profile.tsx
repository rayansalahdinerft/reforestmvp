import { useState } from "react";
import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import FloatingLeaves from "@/components/impact/FloatingLeaves";
import { useWalletStats } from "@/hooks/useWalletStats";
import { useAppKitAccount } from "@reown/appkit/react";
import { supabase } from "@/integrations/supabase/client";
import { User, Edit2, Check, X, DollarSign, Users, Leaf, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import NftGallery from "@/components/impact/NftGallery";

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

const Profile = () => {
  const { stats, loading, isConnected } = useWalletStats();
  const { address } = useAppKitAccount();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const treesPlanted = stats.totalTrees;
  const achievedLevel = [...LEVELS].reverse().find((l) => treesPlanted >= l.target) ?? null;
  const currentLevel = achievedLevel ?? LEVELS[0];

  const co2Absorbed = treesPlanted * 22;
  const oxygenProduced = treesPlanted * 100;
  const showEnv = treesPlanted >= 10;

  const handleEditStart = () => {
    setNameInput(stats.displayName ?? "");
    setEditing(true);
  };

  const handleSave = async () => {
    if (!address) return;
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke("update-display-name", {
        body: { wallet_address: address.toLowerCase(), display_name: nameInput.trim() || null },
      });
      if (error) throw error;
      toast.success("Display name updated");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLeaves />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary/8 to-accent/5 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {!isConnected ? (
          <div className="swap-card p-8 text-center animate-slide-up backdrop-blur-sm">
            <User className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Connect your wallet</h3>
            <p className="text-muted-foreground text-sm">Connect to view your profile.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile hero card */}
            <div className="swap-card p-6 animate-slide-up backdrop-blur-sm">
              <div className="flex items-center gap-5">
                {/* Avatar = current level */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-primary/20 shadow-lg">
                    <img src={currentLevel.avatar} alt={currentLevel.label} className="w-full h-full object-cover" />
                  </div>
                  {achievedLevel && (
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground shadow-lg">
                      {currentLevel.level}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Display name */}
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
                        <h2 className="text-xl font-bold text-foreground truncate">
                          {stats.displayName || shortAddr}
                        </h2>
                        <button onClick={handleEditStart} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{shortAddr}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {achievedLevel ? `Level ${currentLevel.level} — ${currentLevel.label}` : "No level yet"}
                  </p>
                </div>

                {/* Trees count */}
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

            {/* NFT Collection */}
            <NftGallery treesPlanted={treesPlanted} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
