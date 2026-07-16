import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeftRight, Search, Leaf, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/market', label: 'Market', icon: Search },
  { path: '/', label: 'Swap', icon: ArrowLeftRight },
  { path: '/impact', label: 'Impact', icon: Leaf },
  { path: '/portfolio', label: 'Portfolio', icon: BarChart3 },
];

const MobileBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[60] md:hidden pb-[env(safe-area-inset-bottom,0px)] border-t border-border/40 bg-background/95 backdrop-blur-md">
      <div className="grid grid-cols-5 items-stretch">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = pathname === path;
          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              className={`flex flex-col items-center justify-center gap-1 py-3 px-1 transition-colors active:opacity-80 ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 2} />
              <span className={`text-[10px] leading-none tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
