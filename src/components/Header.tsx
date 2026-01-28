import Logo from './Logo';
import ConnectButton from './ConnectButton';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 glass-effect sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden md:flex items-center gap-2">
            <button className="px-5 py-2.5 rounded-2xl bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              Swap
            </button>
            <button className="px-5 py-2.5 rounded-2xl text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-secondary transition-all">
              Portfolio
            </button>
            <button className="px-5 py-2.5 rounded-2xl text-muted-foreground text-sm font-medium hover:text-foreground hover:bg-secondary transition-all">
              Impact
            </button>
          </nav>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
