import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeftRight, Search, Leaf, BarChart3 } from 'lucide-react';

// Ordered for UX: consultation on the left (Home, Market), primary action (Swap) in the center,
// then outcomes on the right (Impact, Portfolio).
const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/market', label: 'Market', icon: Search },
  { path: '/', label: 'Swap', icon: ArrowLeftRight, primary: true },
  { path: '/impact', label: 'Impact', icon: Leaf },
  { path: '/portfolio', label: 'Portfolio', icon: BarChart3 },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="mx-auto max-w-md rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="grid grid-cols-5 items-stretch">
          {navItems.map(({ path, label, icon: Icon, primary }) => {
            const active = pathname === path;
            if (primary) {
              return (
                <Link
                  key={path}
                  to={path}
                  aria-label={label}
                  className="flex flex-col items-center justify-center gap-1 py-2.5 px-2 mx-1 my-1 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-95 transition-all shadow-[0_4px_14px_hsl(var(--primary)/0.4)]"
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={2.5} />
                  <span className="text-[10px] font-bold tracking-wide uppercase leading-none">{label}</span>
                </Link>
              );
            }
            return (
              <Link
                key={path}
                to={path}
                aria-label={label}
                className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-none border-r border-border/30 last:border-r-0 first:border-l-0 transition-all active:scale-95 ${
                  active
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-[20px] h-[20px]" strokeWidth={active ? 2.4 : 2} />
                <span className={`text-[10px] leading-none tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
