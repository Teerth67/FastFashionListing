import React, { useEffect, useState } from "react";
import "./splashScreen.scss";
import LogoImage from "../../assets/f_logo.png"; // Ensure this path is correct

const SplashScreen = ({ onFinish }) => {
  const [slideUp, setSlideUp] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // Longer initial display time
    const timer1 = setTimeout(() => setSlideUp(true), 3000);
    
    // Completely remove after transition
    const timer2 = setTimeout(() => {
      setIsHidden(true);
      onFinish();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  if (isHidden) return null;

  return (
    <div 
      className={`splash-screen ${slideUp ? "slide-up" : ""}`}
    >
      <div className="splash-content">
        <img 
          src={LogoImage} 
          alt="Glitchd Logo" 
          className="splash-logo"
          style={{
            maxWidth: '200px', // Adjust as needed
            maxHeight: '200px', // Adjust as needed
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;