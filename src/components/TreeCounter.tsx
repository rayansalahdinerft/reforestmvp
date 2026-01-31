import { TreePine, Users, DollarSign, Wallet } from 'lucide-react';
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
  const { stats, loading, isConnected } = useWalletStats();

  if (loading) {
    return (
      <div className="flex justify-center gap-8 py-4 animate-pulse">
        <div className="h-12 w-32 bg-secondary rounded-xl" />
        <div className="h-12 w-32 bg-secondary rounded-xl" />
        <div className="h-12 w-32 bg-secondary rounded-xl" />
      </div>
    );
  }

  // If not connected, show a prompt to connect
  if (!isConnected) {
    return (
      <div className="flex justify-center py-4 animate-fade-in">
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border">
          <Wallet className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Connect your wallet to see your impact
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-fade-in">
      {/* Trees Planted */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <TreePine className="w-5 h-5 text-primary animate-glow-pulse" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground tracking-tight tabular-nums">
            <AnimatedNumber value={stats.totalTrees} />
          </p>
          <p className="text-xs font-medium text-muted-foreground">Your Trees</p>
        </div>
      </div>

      {/* Donations */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground tracking-tight tabular-nums">
            <AnimatedNumber value={stats.totalDonationsUsd} prefix="$" />
          </p>
          <p className="text-xs font-medium text-muted-foreground">Your Donations</p>
        </div>
      </div>

      {/* Swaps */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground tracking-tight tabular-nums">
            <AnimatedNumber value={stats.totalSwaps} />
          </p>
          <p className="text-xs font-medium text-muted-foreground">Your Swaps</p>
        </div>
      </div>
    </div>
  );
};

export default TreeCounter;
