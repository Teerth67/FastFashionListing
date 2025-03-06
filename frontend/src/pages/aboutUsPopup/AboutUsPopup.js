import React, { useState, useEffect } from 'react';
import styles from './Popup.module.scss';

const AboutUsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setTimeout(() => {
        setShowPopup(true);
      }, 1000);
      sessionStorage.setItem('hasSeenPopup', 'true');
    }
  }, []);

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 300);
  };

  if (!showPopup) return null;

  return (
    <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`}>
      <div className={`${styles.popup} ${isClosing ? styles.closing : ''}`}>
        <div className={styles.closeButton} onClick={closePopup}>
          ×
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>GLITCH'D</h2>
          
          <p className={styles.mainText}>
            Welcome to GLITCH'D—where the rules of fashion are rewritten, and self-expression knows no limits. We're more than a brand; we're a movement. A rebellion against the ordinary. A space where the bold, the creative, and the unapologetically unique find their fit.
          </p>
          
          <div className={styles.section}>
            <p>The Movement</p>
            <p>Founded in 2023, GLITCH'D was born from a desire to disrupt fast fashion. We're here to blur the lines between trends and individuality—because style isn't about fitting in; it's about standing out. No limits. No labels. Just raw, unfiltered expression.</p>
          </div>
          
          <div className={styles.section}>
            <p>Our Vision</p>
            <p>From underground aesthetics to viral drops, our collections are designed to keep you ahead of the curve. Bold statements. Unfiltered attitude. A global community. A future-forward mindset. Inclusive vibes. Exclusive styles. That's the movement. That's the future.</p>
          </div>
          
          <p className={styles.outro}>
            JOIN THE MOVEMENT. STAY UNFILTERED. STAY GLITCH'D.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;
