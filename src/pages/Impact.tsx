import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useWalletStats } from "@/hooks/useWalletStats";
import { TreePine, DollarSign, Users, Leaf, Sprout, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppKitAccount } from "@reown/appkit/react";

const Impact = () => {
  const { stats, loading, isConnected } = useWalletStats();

  const TREE_COST_USD = 2.5;
  const treesPlanted = stats.totalTrees;
  const co2Absorbed = treesPlanted * 22;
  const oxygenProduced = treesPlanted * 100;

  const impactCards = [
    {
      icon: TreePine,
      value: treesPlanted.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
      label: 'Trees Planted',
      description: 'Based on $2.50 per tree',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: DollarSign,
      value: `$${stats.totalDonationsUsd.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}`,
      label: 'Total Donated',
      description: '40% of all fees collected',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      icon: Users,
      value: stats.totalSwaps.toLocaleString(),
      label: 'Swaps Completed',
      description: 'Each swap plants trees',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Leaf,
      value: `${co2Absorbed.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg`,
      label: 'CO₂ Absorbed/Year',
      description: 'Environmental impact estimate',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <Header />
      <NewsTicker />

      <main className="max-w-4xl mx-auto px-4 py-12 relative z-10">
        {/* Hero */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-primary/20 flex items-center justify-center">
            <Sprout className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Your <span className="text-primary">Impact</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Every swap you make contributes to global reforestation.
          </p>
        </div>

        {/* Connect Wallet CTA when not connected */}
        {!isConnected && (
          <div className="swap-card p-8 text-center mb-12 animate-slide-up">
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
          <div className="grid grid-cols-2 gap-4 mb-12 animate-slide-up">
            {impactCards.map((card, index) => (
              <div
                key={card.label}
                className={`swap-card p-6 border ${card.borderColor} hover:border-opacity-50 transition-all`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${card.bgColor} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1 tabular-nums">
                  {loading ? '—' : card.value}
                </p>
                <p className="text-sm font-semibold text-foreground mb-1">{card.label}</p>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Simple Progress Visual - only when connected */}
        {isConnected && (
          <div className="swap-card p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Your Forest Progress</h3>
                <p className="text-sm text-muted-foreground">Growing with every swap</p>
              </div>
            </div>

            {/* Tree Progress Bar */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Trees planted</span>
                  <span className="font-semibold text-foreground">
                    {treesPlanted.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} / 10
                  </span>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((treesPlanted / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Donations</span>
                  <span className="font-semibold text-foreground">
                    ${stats.totalDonationsUsd.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} / $25
                  </span>
                </div>
                <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((stats.totalDonationsUsd / 25) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Milestone badges */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Milestones</p>
              <div className="flex flex-wrap gap-3">
                <MilestoneBadge 
                  label="First Swap" 
                  achieved={stats.totalSwaps >= 1} 
                />
                <MilestoneBadge 
                  label="$1 Donated" 
                  achieved={stats.totalDonationsUsd >= 1} 
                />
                <MilestoneBadge 
                  label="1 Tree" 
                  achieved={treesPlanted >= 1} 
                />
                <MilestoneBadge 
                  label="5 Swaps" 
                  achieved={stats.totalSwaps >= 5} 
                />
                <MilestoneBadge 
                  label="$10 Donated" 
                  achieved={stats.totalDonationsUsd >= 10} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Environmental Impact Summary */}
        {isConnected && treesPlanted > 0 && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-foreground">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-green-500">{co2Absorbed.toFixed(1)} kg</p>
                <p className="text-xs text-muted-foreground">CO₂ absorbed/year</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-500">{oxygenProduced.toFixed(0)} kg</p>
                <p className="text-xs text-muted-foreground">O₂ produced/year</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-xl font-bold text-primary">{(treesPlanted / 10).toFixed(2)} ha</p>
                <p className="text-xs text-muted-foreground">Forest restored (est.)</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const MilestoneBadge = ({ label, achieved }: { label: string; achieved: boolean }) => (
  <div 
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
      achieved 
        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
        : 'bg-muted/30 text-muted-foreground border border-border'
    }`}
  >
    {achieved && <span className="mr-1">✓</span>}
    {label}
  </div>
);

export default Impact;
