import { Wallet } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Logo />
        <Button variant="connect" size="default">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
};

export default Header;
