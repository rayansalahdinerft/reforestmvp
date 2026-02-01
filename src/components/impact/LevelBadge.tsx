import { TreePine, Sprout, Trees } from "lucide-react";

interface LevelBadgeProps {
  treesPlanted: number;
}

const LevelBadge = ({ treesPlanted }: LevelBadgeProps) => {
  const getLevel = () => {
    if (treesPlanted >= 10000) return { level: 4, name: "Forest", icon: Trees, color: "from-emerald-400 to-green-600" };
    if (treesPlanted >= 1000) return { level: 3, name: "Grove", icon: Trees, color: "from-green-400 to-emerald-500" };
    if (treesPlanted >= 100) return { level: 2, name: "Sapling", icon: TreePine, color: "from-lime-400 to-green-500" };
    if (treesPlanted >= 10) return { level: 1, name: "Seedling", icon: Sprout, color: "from-green-300 to-lime-400" };
    return { level: 0, name: "Starter", icon: Sprout, color: "from-gray-400 to-gray-500" };
  };

  const { level, name, icon: Icon, color } = getLevel();

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
      
      {/* Badge */}
      <div className={`relative bg-gradient-to-br ${color} rounded-3xl p-6 shadow-xl transform transition-all duration-300 group-hover:scale-105`}>
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
        </div>
        
        <div className="relative flex flex-col items-center gap-3">
          {/* Icon with floating animation */}
          <div className="animate-float">
            <Icon className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          
          {/* Level info */}
          <div className="text-center">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Level</p>
            <p className="text-white text-3xl font-bold">{level}</p>
            <p className="text-white font-semibold text-lg">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelBadge;
