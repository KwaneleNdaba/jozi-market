
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'white';
}

const Logo: React.FC<LogoProps> = ({ className = "h-10", variant = 'full' }) => {
  const forest = "#1B5E52";
  const gold = "#C7A16E";
  const white = "#FFFFFF";

  const mainColor = variant === 'white' ? white : forest;
  const secondaryColor = variant === 'white' ? white : gold;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 400 350" 
        className="w-full h-full max-h-[60%]" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Semicircle Skyline Base */}
        <path 
          d="M50 180C50 262.843 117.157 330 200 330C282.843 330 350 262.843 350 180H50Z" 
          fill={mainColor} 
        />
        
        {/* Buildings Silhouette */}
        <path 
          d="M50 180V165H58V155H65V165H68V175H75V180H50Z" 
          fill={mainColor} 
        />
        <path 
          d="M75 180V172H80V175H85V170H95V175H105V172H115V175H125V180H75Z" 
          fill={mainColor} 
        />
        <path 
          d="M125 180V175H135V172H145V175H150V180H125Z" 
          fill={mainColor} 
        />
        <path 
          d="M165 180V172H172V165H180V172H185V180H165Z" 
          fill={mainColor} 
        />
        <path 
          d="M185 180V172H200V175H210V170H230V175H245V180H185Z" 
          fill={mainColor} 
        />
        {/* Hillbrow Tower */}
        <path 
          d="M265 180V80H260V75H265V70H260V65H275V70H270V75H275V80H270V180H265Z" 
          fill={mainColor} 
        />
        <path 
          d="M262 75H273V78H262V75ZM260 70H275V73H260V70Z" 
          fill={mainColor} 
        />
        <path 
          d="M267 70V20H268V70H267Z" 
          fill={mainColor} 
        />
        
        <path 
          d="M275 180V175H285V172H295V170H310V175H325V172H335V175H345V180H275Z" 
          fill={mainColor} 
        />
      </svg>
      
      {/* Typography and Decorative Elements */}
      <div className="flex flex-col items-center mt-[-8%] w-full">
        <h1 
          className="text-lg font-light tracking-[0.2em] mb-0.5 leading-tight" 
          style={{ color: secondaryColor, fontFamily: 'Plus Jakarta Sans' }}
        >
          JOZI MARKET
        </h1>
        <div className="flex items-center w-4/5 gap-1.5">
          <div className="h-px grow" style={{ background: `linear-gradient(to right, transparent, ${secondaryColor})` }} />
          <div className="w-2 h-2 rotate-45" style={{ backgroundColor: secondaryColor }} />
          <div className="h-px grow" style={{ background: `linear-gradient(to left, transparent, ${secondaryColor})` }} />
        </div>
      </div>
    </div>
  );
};

export default Logo;
