import { TreePine } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
        <TreePine className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-foreground tracking-tight">ReforestWallet</span>
        <span className="text-[10px] font-medium text-primary uppercase tracking-widest">Plant Trees Every Swap</span>
      </div>
    </div>
  );
};

export default Logo;
