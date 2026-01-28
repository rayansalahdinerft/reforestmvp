import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import TreeCounter from "@/components/TreeCounter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Tree Counter */}
        <div className="mb-8">
          <TreeCounter />
        </div>

        {/* Swap Card */}
        <SwapCard />

        {/* Footer text */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Every swap plants trees 🌱
        </p>
      </main>
    </div>
  );
};

export default Index;
