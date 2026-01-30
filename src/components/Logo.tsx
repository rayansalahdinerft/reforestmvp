import logoImage from "@/assets/logo.png";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="bg-background rounded-lg p-1">
        <img 
          src={logoImage} 
          alt="ReforestWallet" 
          className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default Logo;
