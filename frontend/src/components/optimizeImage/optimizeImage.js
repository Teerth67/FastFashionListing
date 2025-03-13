import { useState, useEffect } from "react";
import styles from "./OptimizedImage.module.scss";

const getOptimizedImageUrl = (url, screenWidth) => {
  if (!url) return "";

  let imageWidth;
  if (screenWidth < 480) {
    imageWidth = 192; // Mobile
  } else if (screenWidth < 768) {
    imageWidth = 256; // Small tablets
  } else if (screenWidth < 1024) {
    imageWidth = 384; // Large tablets & small laptops
  } else {
    imageWidth = 512; // Desktops
  }

  let optimizedUrl = url; // Start with the original URL

  if (url.includes("/cdn/shop/")) {
    // Ensure `_size.jpg` or `_size.png` is replaced correctly
    optimizedUrl = optimizedUrl.replace(/(_\d+x)\.(jpg|png)/, `_${imageWidth}x.$2`);

    if (url.includes("width=")) {
        // Replace existing width value
        optimizedUrl = optimizedUrl.replace(/width=\d+/, `width=${imageWidth}`);
    } else {
        // Add width if not present
        optimizedUrl += `&width=${imageWidth}`;
    }
}


  // 🏷 Fix {width} placeholder in Shopify URLs (like itgirl.in)
  if (url.includes("{width}")) {
    optimizedUrl = optimizedUrl.replace("{width}", imageWidth);
  }


  // 🏷 Ensure width parameter for other CDN-hosted images (like evemen.co, genrage.com, etc.)
  if ((url.includes("cdn.shopify.com") || url.includes("genrage.com")) && !url.includes("width=")) {
    optimizedUrl += `?width=${imageWidth}`;
  }

  if (url.includes("image.hm.com") && !url.includes("imwidth=")) {
    optimizedUrl += `?imwidth=${imageWidth}`;
  }
  
  return optimizedUrl;
};


const OptimizedImage = ({ 
  src, 
  alt = "Product", 
  className = "", 
  style = {}, 
  sliderMode = false,
  parallaxMode = false 
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//  console.log("src",src)
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add slider-specific styles if sliderMode is true
  const sliderStyles = sliderMode ? {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      paddingTop: 0
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center'
    }
  } : {};

  // Add parallax-specific styles if parallaxMode is true
  const parallaxStyles = parallaxMode ? {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '130%',
    height: '130%',
    objectFit: 'cover',
    objectPosition: 'center'
  } : {};

  // Combine styles, with parallax taking precedence over slider
  const combinedContainerStyle = {
    ...sliderStyles.container,
    ...parallaxStyles
  };

  const combinedImageStyle = {
    ...sliderStyles.image,
    ...parallaxStyles,
    ...style
  };

  return (
    <div 
      className={`${styles.imageContainer} ${className}`} 
      style={combinedContainerStyle}
    >
      <img
        src={getOptimizedImageUrl(src, screenWidth)}
        alt={alt}
        loading="lazy"
        className={`${styles.productImage} ${sliderMode ? 'slider-image' : ''} ${parallaxMode ? 'parallax-image' : ''}`}
        style={combinedImageStyle}
        onError={(e) => {
          e.target.style.display = "none";
          const placeholder = e.target.parentElement.querySelector(`.${styles.imagePlaceholder}`);
          if (placeholder) {
            placeholder.style.display = "flex";
          }
        }}
      />
      <div className={styles.imagePlaceholder} style={{ display: "none" }}>
        Image Not Available
      </div>
    </div>
  );
};

export default OptimizedImage;
