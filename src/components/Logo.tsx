import logoImage from "@/assets/logo.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <img 
        src={logoImage} 
        alt="ReforestWallet" 
        className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
};

export default Logo;
