import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import TreeCounter from "@/components/TreeCounter";
import NewsTicker from "@/components/NewsTicker";
import FloatingLeaves from "@/components/impact/FloatingLeaves";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingLeaves />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px] animate-float" />
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>
      
      <Header />
      <NewsTicker />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-12 relative z-10 pb-20 md:pb-0">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-5 tracking-tight leading-tight animate-hero-reveal">
            <span className="block sm:inline">Every swap</span>{' '}
            <span className="block sm:inline text-primary glow-text animate-glow-reveal">saves the world</span>
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto px-4 animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
            First wallet that makes your transactions useful for the planet. DeFi with purpose.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <TreeCounter />
        </div>

        <div className="flex justify-center mb-4 sm:mb-6">
          <SwapCard />
        </div>

        <div className="hidden sm:flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 text-xs sm:text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>Multi-chain support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>Best rates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>Eco-friendly</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
