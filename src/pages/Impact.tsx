import { useState } from "react";
import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useWalletStats } from "@/hooks/useWalletStats";
import { DollarSign, Users, Leaf, Sprout, Globe, ChevronDown } from "lucide-react";
import FloatingLeaves from "@/components/impact/FloatingLeaves";
import ImpactCard from "@/components/impact/ImpactCard";
import CurrentLevel from "@/components/impact/CurrentLevel";
import NftCertificate from "@/components/impact/NftCertificate";
import ShareImpactCard from "@/components/impact/ShareImpactCard";

const NFT_CERTS = [
  { milestone: 1_000, label: "Forest Steel", description: "1,000 trees planted", rarity: "uncommon" as const },
  { milestone: 10_000, label: "Verdant Bronze", description: "10,000 trees planted", rarity: "rare" as const },
  { milestone: 100_000, label: "Emerald Silver", description: "100K trees planted", rarity: "epic" as const },
  { milestone: 1_000_000, label: "Guardian Gold", description: "1 million trees planted", rarity: "legendary" as const },
  { milestone: 10_000_000, label: "Earth Platinum", description: "10M trees planted", rarity: "mythic" as const },
  { milestone: 100_000_000, label: "Gaia Black Edition", description: "100M trees planted", rarity: "infinity" as const },
];

const Impact = () => {
  const { stats, loading, isConnected } = useWalletStats();
  const [showMore, setShowMore] = useState(false);

  const treesPlanted = stats.totalTrees;
  const showEnvironmentalImpact = treesPlanted >= 1;
  const co2Absorbed = treesPlanted * 22;
  const oxygenProduced = treesPlanted * 100;

  // Find current quest: first card not yet unlocked
  const currentQuestIndex = NFT_CERTS.findIndex((c) => treesPlanted < c.milestone);
  const currentQuest = currentQuestIndex >= 0 ? NFT_CERTS[currentQuestIndex] : NFT_CERTS[NFT_CERTS.length - 1];
  const otherCards = NFT_CERTS.filter((_, i) => i !== (currentQuestIndex >= 0 ? currentQuestIndex : NFT_CERTS.length - 1));

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

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center backdrop-blur-sm border border-green-500/20">
            <Sprout className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Impact</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
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
          <div className="swap-card p-8 text-center mb-10 animate-slide-up backdrop-blur-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Globe className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Connect your wallet</h3>
            <p className="text-muted-foreground text-sm">
              Connect your wallet to see your personal impact.
            </p>
          </div>
        )}

        {isConnected && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

            {/* Level progression */}
            <CurrentLevel treesPlanted={treesPlanted} />

            {/* Current Quest NFT */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">Current Quest</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Plant {currentQuest.milestone.toLocaleString()} trees to earn the <span className="font-semibold text-foreground">{currentQuest.label}</span> certificate
              </p>
              <div className="flex justify-center">
                <NftCertificate
                  milestone={currentQuest.milestone}
                  label={currentQuest.label}
                  description={currentQuest.description}
                  current={treesPlanted}
                  rarity={currentQuest.rarity}
                  featured
                />
              </div>
              {/* Progress toward this quest */}
              <div className="mt-4 max-w-xs mx-auto">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                  <span>{treesPlanted.toLocaleString()} trees</span>
                  <span>{currentQuest.milestone.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                    style={{ width: `${Math.min((treesPlanted / currentQuest.milestone) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Explore more NFT cards */}
            <div>
              <button
                onClick={() => setShowMore((v) => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Explore more NFT cards</span>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-300"
                  style={{ transform: showMore ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {showMore && (
                <div className="mt-4 flex flex-wrap gap-4 justify-center animate-fade-in">
                  {otherCards.map((cert) => (
                    <NftCertificate
                      key={cert.milestone}
                      milestone={cert.milestone}
                      label={cert.label}
                      description={cert.description}
                      current={treesPlanted}
                      rarity={cert.rarity}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Environmental summary */}
            {showEnvironmentalImpact && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-lime-500/10 border border-green-500/20 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "0.25s" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Globe className="w-4.5 h-4.5 text-green-400" />
                  </div>
                  <span className="font-semibold text-foreground">Environmental Impact</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-card/50 border border-green-500/10">
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                      {Math.floor(co2Absorbed).toLocaleString()} kg
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">CO₂ absorbed/year</p>
                  </div>
                  <div className="p-3 rounded-xl bg-card/50 border border-blue-500/10">
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
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
