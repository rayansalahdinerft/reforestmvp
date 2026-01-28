import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import TreeCounter from "@/components/TreeCounter";
import NewsTicker from "@/components/NewsTicker";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      <Header />
      <NewsTicker />
      
      <main className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Swap Tokens, <span className="text-primary glow-text">Plant Trees</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Every trade contributes 1% to global reforestation. DeFi with purpose.
          </p>
        </div>

        {/* Tree Counter */}
        <div className="mb-10">
          <TreeCounter />
        </div>

        {/* Swap Card */}
        <SwapCard />

        {/* Footer stats */}
        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Multi-chain support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>1inch powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Best rates</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
