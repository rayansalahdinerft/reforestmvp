import Header from "@/components/Header";
import ThirdwebBridgeWidget from "@/components/ThirdwebBridgeWidget";

const THIRDWEB_CLIENT_ID = "30620e23089261001eb0b387c50b04a1";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 pt-8 pb-20">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-lg mb-2">
              Clean swaps. Clean future.
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Swap</span> any token,
              <br />
              <span className="text-foreground">save the planet</span>
            </h1>
          </div>

          {/* Thirdweb Bridge Widget */}
          <ThirdwebBridgeWidget clientId={THIRDWEB_CLIENT_ID} />
          
          {/* Eco message */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Every swap plants trees 🌱
          </p>
        </main>
      </div>
    </div>
  );
};

export default Index;
