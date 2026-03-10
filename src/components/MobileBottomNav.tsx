import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight, BarChart3, Trophy, Briefcase, Leaf, CreditCard } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Swap', icon: ArrowLeftRight },
  { path: '/market', label: 'Market', icon: BarChart3 },
  { path: '/leaderboard', label: 'Board', icon: Trophy },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/impact', label: 'Impact', icon: Leaf },
  { path: '/card', label: 'Card', icon: CreditCard },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40">
      <div className="flex items-center justify-around px-1 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1 active:scale-90 ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-all ${active ? 'drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]' : ''}`} />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
