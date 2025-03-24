import { useRef, useEffect, useState } from 'react';
import styles from './Parallex.module.scss';
import p1 from '../../assets/pp1_c.webp';

const ParallaxSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const revealContainerRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible && scrollProgress > 0.5) {
        setScrollProgress(1);
        if (revealContainerRef.current) {
          revealContainerRef.current.style.clipPath = 'inset(0% 0 0 0)';
        }
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isVisible, scrollProgress]);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isNowVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(isNowVisible);
        
        if (isNowVisible) {
          const viewportHeight = window.innerHeight;
          const sectionHeight = rect.height;
          
          let progress = (viewportHeight - rect.top) / (viewportHeight + sectionHeight/4);
          progress = Math.max(0, Math.min(1, progress * 1.3));
          
          if (progress > 0.7) {
            progress = 1;
          }
          
          setScrollProgress(progress);
          
          if (!isMobile && imageRef.current) {
            imageRef.current.style.transform = `scale(${1 + progress * 0.1})`;
            imageRef.current.style.opacity = Math.min(0.3 + progress * 0.8, 1);
          }
          
          if (revealContainerRef.current) {
            revealContainerRef.current.style.clipPath = `inset(${Math.max(0, 100 - progress * 110)}% 0 0 0)`;
          }
        }
      }
    };
   
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };
    
    handleResize();
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5) {
        setIsVisible(true);
        setScrollProgress(1);
        if (revealContainerRef.current) {
          revealContainerRef.current.style.clipPath = 'inset(0% 0 0 0)';
        }
      }
    }
  }, []);

  return (
    <div 
      className={styles['parallax-container']} 
      ref={sectionRef}
      style={{ position: 'relative', zIndex: 1 }}
    >
         {isMobile ? (
        <div className={styles['mobile-card']}>
          <img
            src={p1}
            alt="Men's Collection"
            className={styles['mobile-image']}
          />
          <div className={styles['card-overlay']}>
            <div className={styles['card-content']}>
              <h2 className={styles['card-title']}>Men's Collection</h2>
              <a href="/men" className={styles['card-button']}>Shop Now</a>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles['parallax-wrapper']}>
          <div className={styles['background-placeholder']}></div>
          <div 
            ref={revealContainerRef} 
            className={styles['reveal-container']}
          >
            <img
              ref={imageRef}
              src={p1}
              alt="Product Image"
              className={styles['reveal-image']}
              style={{ opacity: 1 }}
            />
          </div>
          
          <div className={styles['overlay-content']}>
            <div 
              className={`${styles['content-wrapper']} ${isVisible ? styles['fade-in'] : ''}`}
              style={{ 
                opacity: Math.min(scrollProgress * 2, 1),
                transform: `translateY(${(1 - scrollProgress) * 30}px)`
              }}
            >
              <div className={styles['overlay-label']}>
                Homegrown Brand
              </div>
              <h2 className={styles['product-title']}>
                Men's Collection
              </h2>
              <a href="/men" className={styles['product-button']}>
                Shop Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParallaxSection;