import { useEffect, useRef } from 'react';

const AnimatedGlobe = () => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    let rotation = 0;
    const animate = () => {
      rotation += 0.3;
      globe.style.setProperty('--rotation', `${rotation}deg`);
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="flex justify-center py-6">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-pulse-glow" />
        
        {/* Globe container */}
        <div
          ref={globeRef}
          className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(142 50% 25%) 0%, hsl(142 69% 35%) 50%, hsl(142 50% 20%) 100%)',
            boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.4), inset 8px 8px 20px rgba(255,255,255,0.1), 0 0 40px hsl(142 69% 58% / 0.3)',
          }}
        >
          {/* Continents/land patterns - rotating */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              transform: 'rotateY(var(--rotation, 0deg))',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Continent shapes */}
            <div className="absolute top-[15%] left-[20%] w-[25%] h-[20%] bg-primary/40 rounded-full blur-[2px]" />
            <div className="absolute top-[25%] left-[55%] w-[30%] h-[25%] bg-primary/50 rounded-[40%] blur-[2px]" />
            <div className="absolute top-[50%] left-[15%] w-[20%] h-[30%] bg-primary/45 rounded-[30%] blur-[2px]" />
            <div className="absolute top-[45%] left-[60%] w-[25%] h-[20%] bg-primary/35 rounded-full blur-[2px]" />
            <div className="absolute top-[70%] left-[40%] w-[20%] h-[15%] bg-primary/40 rounded-full blur-[2px]" />
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20">
            {/* Latitude lines */}
            <div className="absolute top-[25%] left-0 right-0 h-[1px] bg-primary/50" />
            <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-primary/50" />
            <div className="absolute top-[75%] left-0 right-0 h-[1px] bg-primary/50" />
            
            {/* Longitude curves */}
            <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-primary/50 rounded-full" />
            <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-primary/50 rounded-full" />
            <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-primary/50 rounded-full" />
          </div>

          {/* Highlight/shine */}
          <div 
            className="absolute top-[10%] left-[15%] w-[30%] h-[30%] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            }}
          />

          {/* Atmosphere glow edge */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, transparent 60%, hsl(142 69% 58% / 0.2) 100%)',
            }}
          />
        </div>

        {/* Orbiting leaf particle */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-primary text-lg">🌿</div>
        </div>
        
        {/* Second orbiting particle */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-primary text-sm">🌱</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedGlobe;
