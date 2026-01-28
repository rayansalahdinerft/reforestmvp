import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import ConnectButton from './ConnectButton';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Swap' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/impact', label: 'Impact' },
  ];

  return (
    <header className="w-full py-4 px-6 glass-effect sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  currentPath === item.path
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
