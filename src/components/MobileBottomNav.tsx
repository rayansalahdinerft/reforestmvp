import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeftRight, Search, Leaf, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/', label: 'Swap', icon: ArrowLeftRight },
  { path: '/market', label: 'Market', icon: Search },
  { path: '/impact', label: 'Impact', icon: Leaf },
  { path: '/portfolio', label: 'Portfolio', icon: BarChart3 },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40">
      <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-2xl transition-all duration-200 min-w-[56px] flex-1 active:scale-90 ${
                active
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 transition-all ${active ? 'drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]' : ''}`} strokeWidth={active ? 2.5 : 2} />
                {active && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />
                )}
              </div>
              <span className={`text-[11px] font-medium leading-tight ${active ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
