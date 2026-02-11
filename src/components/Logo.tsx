import leafIcon from "@/assets/leaf-icon.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <img src={leafIcon} alt="ReforestWallet logo" className="w-9 h-9 rounded-xl" />
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-foreground">Reforest</span>
        <span className="text-primary">Wallet</span>
      </span>
    </div>
  );
};

export default Logo;
