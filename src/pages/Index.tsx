import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import TreeCounter from "@/components/TreeCounter";
import NewsTicker from "@/components/NewsTicker";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary glow orb - top right */}
        <div className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px] animate-float" />
        {/* Secondary glow orb - bottom left */}
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>
      
      <Header />
      <NewsTicker />
      
      <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Every swap, <span className="text-primary glow-text">save the world</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
            40% of our 1% fee funds global reforestation. DeFi with purpose.
          </p>
        </div>

        {/* Tree Counter */}
        <div className="mb-8">
          <TreeCounter />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Swap Card - centered on larger screens */}
          <div className="lg:col-span-5 lg:col-start-4">
            <SwapCard />
          </div>
        </div>

        {/* Footer stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>Multi-chain support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>Best rates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <span>Eco-friendly</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
