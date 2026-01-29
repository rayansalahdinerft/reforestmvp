import { useMemo } from 'react';

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  isPositive?: boolean;
}

const SparklineChart = ({ data, width = 120, height = 40, isPositive = true }: SparklineChartProps) => {
  const pathD = useMemo(() => {
    if (!data || data.length < 2) return '';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((price, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M${points.join(' L')}`;
  }, [data, width, height]);

  const areaPathD = useMemo(() => {
    if (!data || data.length < 2) return '';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((price, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x},${y}`;
    });
    
    return `M0,${height} L${points.join(' L')} L${width},${height} Z`;
  }, [data, width, height]);

  if (!data || data.length < 2) {
    return (
      <div 
        className="flex items-center justify-center text-xs text-muted-foreground"
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  const strokeColor = isPositive ? 'hsl(142 76% 52%)' : 'hsl(0 84% 60%)';
  const fillColor = isPositive ? 'hsl(142 76% 52% / 0.1)' : 'hsl(0 84% 60% / 0.1)';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d={areaPathD}
        fill={`url(#sparkline-gradient-${isPositive})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SparklineChart;
