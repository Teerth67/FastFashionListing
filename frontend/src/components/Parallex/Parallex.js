import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Parallex.module.scss';

// Import your image - replace with your actual image path
import heroImage from '../../assets/pp1_c.webp';

const ParallaxSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orientation, setOrientation] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Desktop mouse move handler
  const handleMouseMove = (e) => {
    if (containerRef.current && !isMobile) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5
      });
    }
  };

  // Mobile device orientation handler
  const handleOrientation = (e) => {
    if (isMobile) {
      // Normalize beta (front/back tilt) and gamma (left/right tilt)
      const normalizedBeta = Math.max(Math.min(e.beta, 30), -30) / 30;
      const normalizedGamma = Math.max(Math.min(e.gamma, 30), -30) / 30;
      
      setOrientation({
        x: normalizedGamma,
        y: normalizedBeta
      });
    }
  };

  // Touch interaction handler for mobile
  const handleTouch = (e) => {
    if (isMobile && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      
      setMousePosition({
        x: (touch.clientX - rect.left) / rect.width - 0.5,
        y: (touch.clientY - rect.top) / rect.height - 0.5
      });
    }
  };

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Add device orientation listener for mobile
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Determine transform based on device type
  const getTransform = () => {
    if (isMobile) {
      // For mobile, use device orientation
      return `
        perspective(1000px) 
        translateX(${orientation.x * 30}px) 
        translateY(${orientation.y * 30}px)
        rotateX(${orientation.y * 15}deg)
        rotateY(${-orientation.x * 15}deg)
      `;
    } else {
      // For desktop, use mouse position
      return `
        perspective(1000px) 
        translateX(${mousePosition.x * 20}px) 
        translateY(${mousePosition.y * 20}px)
        rotateX(${mousePosition.y * 10}deg)
        rotateY(${-mousePosition.x * 10}deg)
      `;
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className={styles['enhanced-parallax-container']}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouch}
    >
      <div className={styles['parallax-content']}>
        <div 
          className={styles['image-wrapper']}
          style={{
            transform: getTransform()
          }}
        >
          <img
            src={heroImage}
            alt="Hero Collection"
            className={styles['hero-image']}
          />
        </div>

        <div className={styles['overlay-content']}>
          <div className={styles['content-inner']}>
            <motion.span 
              className={styles['label']}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Collaboration Drip
            </motion.span>
            
            <motion.h2 
              className={styles['title']}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
               Wokelemon
            </motion.h2>
            
            <motion.a 
             // href="/men" 
              className={styles['cta-button']}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              Coming Soon!!
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ParallaxSection;