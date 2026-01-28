import Logo from './Logo';
import ConnectButton from './ConnectButton';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            <button className="px-4 py-2 rounded-full bg-secondary text-foreground text-sm font-medium">
              Swap
            </button>
            <button className="px-4 py-2 rounded-full text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">
              Portfolio
            </button>
          </nav>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
