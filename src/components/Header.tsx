import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import ConnectButton from './ConnectButton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  // Swipe from right edge to open menu on mobile
  useSwipeGesture({
    onSwipeLeft: () => {
      if (isMobile) setOpen(true);
    },
  });

  const navItems = [
    { path: '/', label: 'Swap' },
    { path: '/market', label: 'Market' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/impact', label: 'Impact' },
  ];

  return (
    <header className="w-full py-3 px-6 glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="transition-all">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentPath === item.path
                    ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_hsl(var(--primary)/0.2)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <ConnectButton />
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
                <Menu className="w-5 h-5 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background border-border">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      currentPath === item.path
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
