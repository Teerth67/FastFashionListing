import React, { useEffect, useRef, useState } from 'react';
import './ZoomScrollEffect.module.scss';

const ZoomScrollEffect = ({ 
  imageUrl, 
  title = "", 
  subtitle = "", 
  overlayOpacity = 0.3,
  animationDuration = 15,
  maxZoom = 1.2 
}) => {
  const zoomBackgroundRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    
    const handleLoad = () => {
      setImageLoaded(true);
      startAnimation();
    };

    img.onload = handleLoad;
    img.onerror = (err) => console.error("Image load error:", err);

    return () => {
      img.onload = null;
      img.onerror = null;
      if (animationRef.current) animationRef.current.cancel();
    };
  }, [imageUrl]);

  const startAnimation = () => {
    if (!zoomBackgroundRef.current) return;

    if (animationRef.current) {
      animationRef.current.cancel();
    }

    animationRef.current = zoomBackgroundRef.current.animate(
      [
        { transform: 'scale(1)' },
        { transform: `scale(${maxZoom})` }
      ], 
      {
        duration: animationDuration * 1000,
        iterations: Infinity,
        easing: 'ease-in-out',
        direction: 'alternate',
      }
    );
  };

  useEffect(() => {
    if (imageLoaded) startAnimation();
  }, [maxZoom, animationDuration, imageLoaded]);

  return (
    <section className="hero-section">
      <div className="zoom-container">
        <div 
          className="overlay" 
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        />
        <div className="zoom-background" ref={zoomBackgroundRef}>
          <img 
            src={imageUrl} 
            alt="Hero background" 
            className="zoom-image"
            onError={(e) => console.error("Image failed to load:", e)}
          />
        </div>
      </div>
      <div className="content">
        {title && <h1>{title}</h1>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
};

export default ZoomScrollEffect;