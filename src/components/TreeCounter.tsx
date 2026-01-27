import { TreePine, Users, DollarSign } from 'lucide-react';
import { useTreeCounter } from '@/hooks/useTreeCounter';

const TreeCounter = () => {
  const { stats, loading } = useTreeCounter();

  if (loading) {
    return (
      <div className="flex justify-center gap-8 py-4 animate-pulse">
        <div className="h-12 w-32 bg-secondary rounded-xl" />
        <div className="h-12 w-32 bg-secondary rounded-xl" />
        <div className="h-12 w-32 bg-secondary rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 py-4">
      {/* Trees Planted */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
        <TreePine className="w-5 h-5 text-primary" />
        <div>
          <p className="text-lg md:text-xl font-bold text-primary">
            {stats.totalTrees.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-muted-foreground">arbres plantés</p>
        </div>
      </div>

      {/* Donations */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/50 border border-border/50">
        <DollarSign className="w-5 h-5 text-foreground" />
        <div>
          <p className="text-lg md:text-xl font-bold text-foreground">
            ${stats.totalDonationsUsd.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-muted-foreground">reversés</p>
        </div>
      </div>

      {/* Swaps */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/50 border border-border/50">
        <Users className="w-5 h-5 text-foreground" />
        <div>
          <p className="text-lg md:text-xl font-bold text-foreground">
            {stats.totalSwaps.toLocaleString('fr-FR')}
          </p>
          <p className="text-xs text-muted-foreground">swaps</p>
        </div>
      </div>
    </div>
  );
};

export default TreeCounter;
