import Logo from './Logo';
import ConnectButton from './ConnectButton';

const Header = () => {
  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Logo />
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
