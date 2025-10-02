import logo from "@/assets/logo.jpg";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "h-12" }: LogoProps) => {
  return (
    <img 
      src={logo} 
      alt="Class Roll Buddy Logo" 
      className={className}
    />
  );
};

export default Logo;
