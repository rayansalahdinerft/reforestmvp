import { LucideIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedCounter from "./AnimatedCounter";

interface ImpactCardProps {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  description: string;
  color: string;
  loading?: boolean;
  index?: number;
  locked?: boolean;
  displayValue?: string | null;
}

const ImpactCard = ({
  icon: Icon,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  label,
  description,
  color,
  loading = false,
  index = 0,
  locked = false,
  displayValue,
}: ImpactCardProps) => {
  const colorClasses: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    green: {
      bg: "bg-green-500/10",
      text: "text-green-500",
      border: "border-green-500/20 hover:border-green-500/40",
      glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    },
    primary: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20 hover:border-primary/40",
      glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20 hover:border-blue-500/40",
      glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    },
  };

  const colors = colorClasses[color] || colorClasses.green;

  return (
    <div
      className={cn(
        "group relative p-6 rounded-3xl border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm",
        "transition-all duration-500 cursor-default",
        "hover:translate-y-[-4px]",
        colors.border,
        colors.glow,
        "animate-slide-up",
        locked && "opacity-70"
      )}
      style={{
        animationDelay: `${index * 0.1}s`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D tilt effect on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon */}
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110", colors.bg)}>
        {locked ? (
          <Lock className="w-7 h-7 text-muted-foreground" />
        ) : (
          <Icon className={cn("w-7 h-7 animate-glow-pulse", colors.text)} />
        )}
      </div>
      
      {/* Value */}
      <p className="text-3xl font-bold text-foreground mb-1">
        {loading ? (
          <span className="text-muted-foreground">—</span>
        ) : locked ? (
          <span className="text-muted-foreground">🔒</span>
        ) : displayValue ? (
          <span className="tabular-nums">{displayValue}</span>
        ) : (
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
            duration={1500 + index * 200}
          />
        )}
      </p>
      
      {/* Label & description */}
      <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default ImpactCard;
