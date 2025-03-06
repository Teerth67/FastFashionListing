import { useEffect, useState } from 'react';
import styles from './Parallex.module.scss';
import p1 from '../../assets/pp1_c.webp'
import OptimizedImage from '../optimizeImage/optimizeImage';


const ParallaxSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);

    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };
    
    // Set initial state
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate initial position to ensure image fills container at top
  const initialOffset = -50; // Negative offset to pull image up at start

  return (
    <div className={styles['parallax-container']}>
      {isMobile ? (
        // Mobile version with floating cards
        <>
          <div className={`${styles['mobile-card']} ${styles['men-card']}`}>
            <div className={styles['card-content']}>
              <h2 className={styles['card-title']}>Men's Collection</h2>
              <a href="/men" className={styles['card-button']}>Shop Now</a>
            </div>
          </div>
          
          <div className={`${styles['mobile-card']} ${styles['women-card']}`}>
            <div className={styles['card-content']}>
              <h2 className={styles['card-title']}>Women's Collection</h2>
              <a href="/women" className={styles['card-button']}>Shop Now</a>
            </div>
          </div>
        </>
      ) : (
        // Desktop version with parallax effect
        <div className={styles['sticky-container']}>
          <div className={styles['parallax-section']}>
            {/* Left Section */}
            <div className={styles['image-container']}>
              <OptimizedImage  
                src={p1}
                alt="Product Image"
                className={styles['parallax-image']}
                style={{
                  transform: `translateY(${initialOffset + scrollPosition * 0.3}px)`
                }}
              />
            </div>

            {/* Right Section */}
            <div className={styles['content-container']}>
              <div 
                className={`${styles['content-wrapper']} ${styles['fade-in']}`}
                style={{
                  transform: `translateY(${scrollPosition * -0.3}px)`
                }}
              >
                <h2 className={styles['product-title']}>
                  Men's Collection
                </h2>
                <a
                  href="/men"
                  className={styles['product-description']}
                  style={{ cursor: 'pointer' }}
                >
                  Shop now ...
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParallaxSection;