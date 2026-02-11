import leafIcon from "@/assets/leaf-icon.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <img src={leafIcon} alt="ReforestWallet logo" className="w-8 h-8 rounded-lg" />
      <span className="text-xl font-bold">
        <span className="text-foreground">Reforest</span>
        <span className="text-primary">Wallet</span>
      </span>
    </div>
  );
};

export default Logo;
