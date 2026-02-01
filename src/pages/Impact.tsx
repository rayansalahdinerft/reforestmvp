import Header from "@/components/Header";
import NewsTicker from "@/components/NewsTicker";
import { useWalletStats } from "@/hooks/useWalletStats";
import { TreePine, DollarSign, Users, Leaf, Sprout, Globe } from "lucide-react";
import { useMemo } from "react";

const TREE_COST_USD = 2.5;

const Impact = () => {
  const { stats, loading, isConnected } = useWalletStats();

  const treesPlanted = stats.totalTrees;
  
  // Calculate meaningful environmental impact only for >= 1 tree
  const showEnvironmentalImpact = treesPlanted >= 1;
  const co2Absorbed = treesPlanted * 22; // kg per year
  const oxygenProduced = treesPlanted * 100; // kg per year

  // Dynamic tier system
  const tiers = useMemo(() => {
    const swapTier = stats.totalSwaps >= 100 ? 1000 : 100;
    const donationTier = stats.totalDonationsUsd >= 100 ? 1000 : 100;
    const treeTier = treesPlanted >= 40 ? 400 : 40; // 100$ / 2.5 = 40 trees, 1000$ = 400 trees
    
    return { swapTier, donationTier, treeTier };
  }, [stats.totalSwaps, stats.totalDonationsUsd, treesPlanted]);

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
      value: showEnvironmentalImpact ? `${Math.floor(co2Absorbed).toLocaleString()} kg` : '—',
      label: 'CO₂ Absorbed/Year',
      description: showEnvironmentalImpact ? 'Environmental impact estimate' : 'Plant 1+ tree to unlock',
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

        {/* Objectives Section */}
        {isConnected && (
          <div className="swap-card p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Objectives</h3>
                <p className="text-sm text-muted-foreground">
                  {tiers.swapTier === 1000 ? 'Tier 2 - Expert Reforester' : 'Tier 1 - Getting Started'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MilestoneGoal 
                label={`${tiers.swapTier} Swaps`}
                current={stats.totalSwaps}
                target={tiers.swapTier}
                icon="🔄"
              />
              <MilestoneGoal 
                label={`$${tiers.donationTier} Donated`}
                current={stats.totalDonationsUsd}
                target={tiers.donationTier}
                prefix="$"
              />
              <MilestoneGoal 
                label={`${tiers.treeTier} Trees`}
                current={treesPlanted}
                target={tiers.treeTier}
                icon="🌳"
              />
            </div>
          </div>
        )}

        {/* Environmental Impact Summary - only show when meaningful */}
        {isConnected && showEnvironmentalImpact && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-foreground">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-green-500">{Math.floor(co2Absorbed).toLocaleString()} kg</p>
                <p className="text-xs text-muted-foreground">CO₂ absorbed/year</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-500">{Math.floor(oxygenProduced).toLocaleString()} kg</p>
                <p className="text-xs text-muted-foreground">O₂ produced/year</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

interface MilestoneGoalProps {
  label: string;
  current: number;
  target: number;
  prefix?: string;
  icon?: string;
}

const MilestoneGoal = ({ label, current, target, prefix = '', icon }: MilestoneGoalProps) => {
  const achieved = current >= target;
  const progress = Math.min((current / target) * 100, 100);
  
  const formatValue = (val: number) => {
    return prefix + val.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  };

  return (
    <div 
      className={`p-4 rounded-xl border transition-all ${
        achieved 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-card border-border'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-lg">{icon}</span>}
        <span className={`text-sm font-medium ${achieved ? 'text-green-500' : 'text-foreground'}`}>
          {achieved && '✓ '}{label}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mb-2">
        {formatValue(current)} / {formatValue(target)}
      </div>
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-700 ${
            achieved ? 'bg-green-500' : 'bg-primary/60'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-xs text-muted-foreground mt-1">
        {progress.toFixed(1)}%
      </div>
    </div>
  );
};

export default Impact;
