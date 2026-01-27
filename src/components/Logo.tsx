import { Leaf } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
          <Leaf className="w-7 h-7 text-primary" strokeWidth={2.5} />
        </div>
        <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse-glow" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold">
          <span className="text-primary">Reforest</span>
          <span className="text-foreground">Wallet</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
