import React, { useEffect, useState } from 'react';
import styles from "./AboutUs.module.scss";

const AboutUs = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const animateOnScroll = () => {
      const container = document.querySelector(`.${styles.aboutContainer}`);
      if (container) {
        const containerPosition = container.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (containerPosition < screenPosition) {
          setIsAnimated(true);
        }
      }
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <section 
      className={`${styles.aboutContainer} ${isAnimated ? styles.animated : ''}`}
    >
      <h1 
        className={styles.title} 
        style={{
          transform: isAnimated ? 'translateY(0)' : 'translateY(50px)',
          opacity: isAnimated ? 1 : 0,
          transition: 'transform 0.7s ease, opacity 0.7s ease'
        }}
      >
        ABOUT US
      </h1>
      <h2 className={styles.subtitle}>FASHION SO WRONG, IT'S RIGHT.</h2>
      <p className={styles.description}>
        Welcome to <span className={styles.brand}>GLITCH'D</span>—where the rules of fashion are rewritten, and self-expression knows no limits. We're more than a brand; we're a movement. A rebellion against the ordinary. A space where the bold, the creative, and the unapologetically unique find their fit.
      </p>
      <p className={styles.description}>
        The Movement Founded in 2023, <span className={styles.brand}>GLITCH'D</span> was born from a desire to disrupt fast fashion. We're here to blur the lines between trends and individuality—because style isn't about fitting in; it's about standing out. No limits. No labels. Just raw, unfiltered expression.
      </p>
      <p className={styles.description}>
        Our Vibe We curate the freshest, most daring streetwear from across the globe, so you don't have to spend hours scrolling. From underground aesthetics to viral drops, our collections are designed to keep you ahead of the curve. Bold statements. Unfiltered attitude. A global community. A future-forward mindset. Inclusive vibes. Exclusive styles. That's the movement. That's the future.
      </p>
      <p className={styles.description}>
        Join The Future Right now, you're not just shopping; you're stepping into a fashion revolution. We're powering your style journey with exclusive drops, curated edits, and cutting-edge tech that brings the best of streetwear to your fingertips. And we're just getting started. Soon, we'll be onboarding independent designers, unlocking exclusive collabs, and building a platform where every trendsetter has a voice. Because at <span className={styles.brand}>GLITCH'D</span>, you don't just wear the trend—you create it.
      </p>
      <p className={styles.description}>
        Our Promises Trendsetting streetwear that pushes boundaries. Sustainability woven into our process. Limited-edition drops every week. A community-first approach—because fashion is personal.
      </p>
      <p className={styles.description}>
        So, if you're ready to <span className={styles.highlight}>GLITCH THE SYSTEM</span>, welcome to the new era of fashion.
      </p>
      <h3 className={styles.tagline}>JOIN THE MOVEMENT. STAY UNFILTERED. STAY GLITCH'D.</h3>
    </section>
  );
};

export default AboutUs;