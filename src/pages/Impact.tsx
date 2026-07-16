import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useWalletStats } from "@/hooks/useWalletStats";
import { useWallet } from "@/hooks/useWallet";
import { DollarSign, Users, Leaf, Globe } from "lucide-react";
import FloatingLeaves from "@/components/impact/FloatingLeaves";
import ImpactCard from "@/components/impact/ImpactCard";
import ShareImpactCard from "@/components/impact/ShareImpactCard";

const Impact = () => {
  const { stats, loading, isConnected } = useWalletStats();
  const { openConnect } = useWallet();

  const treesPlanted = stats.totalTrees;
  const showEnvironmentalImpact = treesPlanted >= 1;
  const co2Absorbed = treesPlanted * 22;
  const oxygenProduced = treesPlanted * 100;

  const impactCards = [
    {
      icon: Leaf,
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
      description: "10% of all fees donated",
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
      icon: Globe,
      value: 0,
      suffix: "",
      label: "CO₂ Absorbed/Year",
      description: showEnvironmentalImpact ? "Environmental impact estimate" : "Unlock at Lv.1 (1 tree)",
      color: "emerald",
      locked: !showEnvironmentalImpact,
      displayValue: showEnvironmentalImpact ? `${Math.floor(co2Absorbed).toLocaleString()} kg` : null,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLeaves />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-green-500/8 to-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-lime-500/5 to-green-500/8 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-6 sm:mb-10 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Impact</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-3 sm:mb-4">
            Every swap levels you up and plants trees.
          </p>
          {isConnected && (
            <ShareImpactCard
              treesPlanted={treesPlanted}
              totalDonationsUsd={stats.totalDonationsUsd}
              totalSwaps={stats.totalSwaps}
              co2Absorbed={co2Absorbed}
            />
          )}
        </div>

        {/* Connect Wallet CTA */}
        {!isConnected && (
          <div className="swap-card p-5 sm:p-8 text-center mb-6 sm:mb-10 animate-slide-up backdrop-blur-sm cursor-pointer hover:border-primary/30 transition-all" onClick={() => openConnect()}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Connect your wallet</h3>
            <p className="text-muted-foreground text-sm">
              Tap here to connect and see your personal impact.
            </p>
          </div>
        )}

        {isConnected && (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
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

            {/* Environmental summary */}
            {showEnvironmentalImpact && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-lime-500/10 border border-green-500/20 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "0.25s" }}>
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-foreground">Environmental Impact</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-card/50 border border-green-500/10">
                    <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                      {Math.floor(co2Absorbed).toLocaleString()} kg
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">CO₂ absorbed/year</p>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-card/50 border border-blue-500/10">
                    <p className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
                      {Math.floor(oxygenProduced).toLocaleString()} kg
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">O₂ produced/year</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Impact;
