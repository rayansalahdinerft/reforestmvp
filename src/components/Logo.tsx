import reforestLogo from "@/assets/reforest-logo.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-1.5 cursor-pointer">
      <img src={reforestLogo} alt="ReforestWallet logo" className="h-8 md:h-10 w-auto" />
    </div>
  );
};

export default Logo;
