import leafIcon from "@/assets/leaf-icon.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-1.5 cursor-pointer">
      <img src={leafIcon} alt="ReforestWallet logo" className="w-9 h-9 md:w-[46px] md:h-[46px] rounded-xl" />
      <span className="text-lg md:text-[22px] font-bold tracking-tight leading-none">
        <span className="text-foreground">Reforest</span>
        <span className="text-primary">Wallet</span>
      </span>
    </div>
  );
};

export default Logo;
