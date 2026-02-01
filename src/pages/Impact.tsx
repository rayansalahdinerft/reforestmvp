import { useCallback } from "react";
import confetti from "canvas-confetti";
import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useWalletStats } from "@/hooks/useWalletStats";
import { TreePine, DollarSign, Users, Leaf, Sprout, Globe } from "lucide-react";
import FloatingLeaves from "@/components/impact/FloatingLeaves";
import ImpactCard from "@/components/impact/ImpactCard";
import TreeLevel from "@/components/impact/TreeLevel";

const TREE_COST_USD = 2.5;

const Impact = () => {
  const { stats, loading, isConnected } = useWalletStats();

  const treesPlanted = stats.totalTrees;
  
  // Calculate meaningful environmental impact only for >= 10 trees (Level 1 Seedling)
  const showEnvironmentalImpact = treesPlanted >= 10;
  const co2Absorbed = treesPlanted * 22; // kg per year
  const oxygenProduced = treesPlanted * 100; // kg per year

  const triggerConfetti = useCallback(() => {
    const colors = ["#22c55e", "#10b981", "#34d399", "#6ee7b7"];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });
  }, []);

  const impactCards = [
    {
      icon: TreePine,
      value: treesPlanted,
      decimals: 2,
      label: "Trees Planted",
      description: "Based on $2.50 per tree",
      color: "green",
    },
    {
      icon: DollarSign,
      value: stats.totalDonationsUsd,
      prefix: "$",
      decimals: 2,
      label: "Total Donated",
      description: "40% of all fees collected",
      color: "primary",
    },
    {
      icon: Users,
      value: stats.totalSwaps,
      label: "Swaps Completed",
      description: "Each swap plants trees",
      color: "blue",
    },
    {
      icon: Leaf,
      value: 0,
      suffix: "",
      label: "CO₂ Absorbed/Year",
      description: showEnvironmentalImpact ? "Environmental impact estimate" : "🔒 Unlock at Lv.1 (10 trees)",
      color: "emerald",
      locked: !showEnvironmentalImpact,
      displayValue: showEnvironmentalImpact ? `${Math.floor(co2Absorbed).toLocaleString()} kg` : null,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating leaves animation */}
      <FloatingLeaves />

      {/* Background effects - organic nature style */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-green-500/8 to-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-lime-500/5 to-green-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center backdrop-blur-sm border border-green-500/20">
            <Sprout className="w-10 h-10 text-green-500 animate-glow-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">Impact</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Every swap you make contributes to global reforestation.
          </p>
        </div>

        {/* Connect Wallet CTA when not connected */}
        {!isConnected && (
          <div className="swap-card p-8 text-center mb-12 animate-slide-up backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Connect your wallet</h3>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to see your personal impact and contribution to reforestation.
            </p>
          </div>
        )}

        {/* Impact Stats Cards */}
        {isConnected && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {impactCards.map((card, index) => (
              <ImpactCard
                key={card.label}
                icon={card.icon}
                value={card.value}
                prefix={card.prefix}
                suffix={card.suffix}
                decimals={card.decimals}
                label={card.label}
                description={card.description}
                color={card.color}
                loading={loading}
                index={index}
                locked={card.locked}
                displayValue={card.displayValue}
              />
            ))}
          </div>
        )}

        {/* Reforestation Levels */}
        {isConnected && (
          <div className="swap-card p-8 animate-slide-up backdrop-blur-sm" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Reforestation Levels</h3>
                <p className="text-sm text-muted-foreground">Plant trees to unlock new levels</p>
              </div>
            </div>

            <div className="space-y-3">
              <TreeLevel level={1} label="Seedling" target={10} current={treesPlanted} onAchieve={triggerConfetti} />
              <TreeLevel level={2} label="Sapling" target={100} current={treesPlanted} onAchieve={triggerConfetti} />
              <TreeLevel level={3} label="Grove" target={1000} current={treesPlanted} onAchieve={triggerConfetti} />
              <TreeLevel level={4} label="Forest" target={10000} current={treesPlanted} onAchieve={triggerConfetti} />
            </div>
          </div>
        )}

        {/* Environmental Impact Summary */}
        {isConnected && showEnvironmentalImpact && (
          <div 
            className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-lime-500/10 border border-green-500/20 backdrop-blur-sm animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <span className="font-semibold text-foreground text-lg">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-card/50 border border-green-500/10">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  {Math.floor(co2Absorbed).toLocaleString()} kg
                </p>
                <p className="text-sm text-muted-foreground mt-1">CO₂ absorbed/year</p>
              </div>
              <div className="p-4 rounded-2xl bg-card/50 border border-blue-500/10">
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                  {Math.floor(oxygenProduced).toLocaleString()} kg
                </p>
                <p className="text-sm text-muted-foreground mt-1">O₂ produced/year</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Impact;
