import { useState } from "react";
import { ArrowUpDown, Info, Leaf } from "lucide-react";
import { Button } from "./ui/button";
import TokenSelector from "./TokenSelector";

const SwapCard = () => {
  const [activeTab, setActiveTab] = useState<"swap" | "buy">("swap");
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  const handleSwapTokens = () => {
    // Swap the values
    const temp = sellAmount;
    setSellAmount(buyAmount);
    setBuyAmount(temp);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-secondary/30 rounded-full w-fit">
        <Button
          variant="tab"
          data-active={activeTab === "swap"}
          onClick={() => setActiveTab("swap")}
        >
          Swap
        </Button>
        <Button
          variant="tab"
          data-active={activeTab === "buy"}
          onClick={() => setActiveTab("buy")}
        >
          Buy
        </Button>
      </div>

      {/* Swap Container */}
      <div className="glass-card rounded-3xl p-4 relative" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Background glow */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-50 pointer-events-none"
          style={{ background: "var(--gradient-glow)" }}
        />
        
        <div className="relative space-y-2">
          {/* Sell Token */}
          <TokenSelector
            label="Sell"
            amount={sellAmount}
            usdValue={sellAmount ? (parseFloat(sellAmount) * 2500).toFixed(2) : "0"}
            onAmountChange={setSellAmount}
            onTokenSelect={() => {}}
          />

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapTokens}
              className="w-10 h-10 rounded-xl bg-card border-4 border-background flex items-center justify-center hover:bg-secondary transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Buy Token */}
          <TokenSelector
            label="Buy"
            amount={buyAmount}
            usdValue={buyAmount ? (parseFloat(buyAmount) * 2500).toFixed(2) : "0"}
            onAmountChange={setBuyAmount}
            onTokenSelect={() => {}}
            readOnly
          />

          {/* Fee Info */}
          <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Leaf className="w-3 h-3 text-primary" />
              <span>1% ReforestWallet fee • DEX fees included</span>
              <Info className="w-3 h-3 ml-auto cursor-help" />
            </div>
          </div>

          {/* Swap Button */}
          <Button variant="swap" size="full" className="mt-4">
            Swap
          </Button>
        </div>
      </div>

      {/* Eco message */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Every swap plants trees 🌱
      </p>
    </div>
  );
};

export default SwapCard;
