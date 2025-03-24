import {useRef, useEffect, useState } from 'react';
import styles from './Parallex.module.scss';

import dummy2 from '../../assets/d2.webp'
import OptimizedImage from '../optimizeImage/optimizeImage';
const ParallaxSection2 = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sectionPosition, setSectionPosition] = useState(0);
  const sectionRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      if (sectionRef.current) {
        // Get the section's position relative to the viewport
        const rect = sectionRef.current.getBoundingClientRect();
        setSectionPosition(rect.top);
      }
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

  // Initial offset to ensure image fills container at top
  const initialOffset = -50;

  // On mobile, this component doesn't need to render anything
  // as the cards are already rendered in ParallaxSection
  if (isMobile) {
    return null;
  }

  return (
    <div className={styles['parallax-container']} ref={sectionRef}>
      <div className={styles['sticky-container']}>
        <div className={styles['parallax-section']}>
          {/* Right Section */}
          <div className={styles['content-container']}>
            <div 
              className={`${styles['content-wrapper']} ${styles['fade-in']}`}
              style={{
                transform: `translateY(${scrollPosition * -0.3}px)`
              }}
            >
              <h2 className={styles['product-title']}>
                Women's Collection
              </h2>
              <a
                href="/women"
                className={styles['product-description']}
                style={{ cursor: 'pointer' }}
              >
                Shop now ...
              </a>
            </div>
          </div>

          {/* Left Section */}
          <div className={styles['image-container']}>
            <OptimizedImage 
              src={dummy2}
              alt="Product Image"
              className={styles['parallax-image']}
              style={{
                transform: sectionPosition < window.innerHeight && sectionPosition > -window.innerHeight 
                ? `translateY(${(window.innerHeight - sectionPosition) * 0.3}px)`
                : 'translateY(0)'              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxSection2;