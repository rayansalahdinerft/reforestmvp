import { Leaf } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
        <Leaf className="w-5 h-5 text-accent-foreground" />
      </div>
      <span className="text-lg font-semibold text-foreground">ReforestWallet</span>
    </div>
  );
};

export default Logo;
