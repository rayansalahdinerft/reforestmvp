import leafIcon from "@/assets/leaf-icon.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2.5 cursor-pointer">
      <img src={leafIcon} alt="ReforestWallet logo" className="w-[42px] h-[42px] rounded-xl" />
      <span className="text-[22px] font-bold tracking-tight leading-none">
        <span className="text-foreground">Reforest</span>
        <span className="text-primary">Wallet</span>
      </span>
    </div>
  );
};

export default Logo;
