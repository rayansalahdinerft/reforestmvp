import { TreePine, Users, DollarSign } from 'lucide-react';
import { useWalletStats } from '@/hooks/useWalletStats';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  className?: string;
}

const AnimatedNumber = ({ value, prefix = '', className }: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    if (value !== previousValue.current) {
      setIsAnimating(true);
      
      const startValue = previousValue.current;
      const endValue = value;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeOutCubic;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setTimeout(() => setIsAnimating(false), 300);
        }
      };

      requestAnimationFrame(animate);
      previousValue.current = value;
    }
  }, [value]);

  return (
    <span
      className={cn(
        'transition-all duration-300',
        isAnimating && 'scale-110 text-primary',
        className
      )}
    >
      {prefix}{displayValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
    </span>
  );
};

const TreeCounter = () => {
  const { stats, loading } = useWalletStats();

  // Always render the 3 boxes; show 0 while disconnected/loading, then update live.
  const treesValue = loading ? 0 : stats.totalTrees;
  const donationsValue = loading ? 0 : stats.totalDonationsUsd;
  const swapsValue = loading ? 0 : stats.totalSwaps;

  return (
    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 md:gap-6 animate-fade-in">
      {/* Trees Planted */}
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 px-2 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <TreePine className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-glow-pulse" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm sm:text-xl font-bold text-foreground tracking-tight tabular-nums">
            <AnimatedNumber value={treesValue} />
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Trees</p>
        </div>
      </div>

      {/* Donations */}
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 px-2 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm sm:text-xl font-bold text-foreground tracking-tight tabular-nums">
            <AnimatedNumber value={donationsValue} prefix="$" />
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Donated</p>
        </div>
      </div>

      {/* Swaps */}
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 px-2 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm sm:text-xl font-bold text-foreground tracking-tight tabular-nums">
            <AnimatedNumber value={swapsValue} />
          </p>
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Swaps</p>
        </div>
      </div>
    </div>
  );
};

export default TreeCounter;
