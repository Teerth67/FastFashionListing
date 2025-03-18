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

          <p className={styles.tagline}>The Only Fashion Destination Made For <span className={styles.highlight}>Gen Z</span>, By <span className={styles.highlight}>Gen Z</span>.</p>

          <p className={styles.mainText}>
            We <span>list and compare</span> all the hottest Gen Z fashion brands in <strong>one place</strong>. Browse listings from streetwear icons like <strong>Jaywalkings</strong> and <strong>AlmostGods</strong> to trending fast fashion from <strong>H&M</strong>, <strong>It Girl</strong>, <strong>Outcasts</strong> and many more—everything Gen Z loves, all <span>without switching between sites</span>.
          </p>

          <ul className={styles.list}>
            <li className={styles.featured}><span className={styles.highlight}>One-stop shop.</span> Zero hassle. Just <span className={styles.highlight}>pure fashion</span>.</li>
            <li>No more <span className={styles.highlight}>endless scrolling</span> for brands.</li>
            <li>We bring the <span className={styles.highlight}>best</span>, you make the <span className={styles.highlight}>statement</span>.</li>
            <li><span className={styles.highlight}>All your favorite brands</span>, all in <strong>one place</strong>.</li>
          </ul>

          <p className={styles.outro}>DISCOVER YOUR STYLE. START NOW.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;