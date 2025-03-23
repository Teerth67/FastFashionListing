import React, { useState } from "react";
import "./casualwearCard.scss";

const CasualWearBrands = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showAllFast, setShowAllFast] = useState(false);
  const [showAllLocal, setShowAllLocal] = useState(false);

  const fastFashionBrands = [
    { id: 1, title: "H&M", image: "/images/hnm.jpg", buttonText: "EXPLORE NOW", link: "/collections/HnM" },
    { id: 2, title: "Zara", image: "/images/zara.jpg", buttonText: "EXPLORE NOW", link: "/collections/Zara" },
    { id: 3, title: "Uniqlo", image: "/images/uniqlo.jpg", buttonText: "EXPLORE NOW", link: "/collections/Uniqlo" },
    { id: 4, title: "Forever 21", image: "/images/forever21.jpg", buttonText: "EXPLORE NOW", link: "/collections/Forever21" },
    { id: 5, title: "Bershka", image: "/images/bershka.jpg", buttonText: "EXPLORE NOW", link: "/collections/Bershka" },
    { id: 6, title: "Pull & Bear", image: "/images/pullbear.jpg", buttonText: "EXPLORE NOW", link: "/collections/PullBear" }
  ];

  const localGenZBrands = [
    { id: 1, title: "Snitch", image: "/images/snitch.jpg", buttonText: "EXPLORE NOW", link: "/collections/Snitch" },
    { id: 2, title: "Dead Bear", image: "/images/deadbear.jpg", buttonText: "EXPLORE NOW", link: "/collections/DeadBear" },
    { id: 3, title: "Outcasts", image: "/images/outcasts.jpg", buttonText: "EXPLORE NOW", link: "/collections/Outcasts" },
    { id: 4, title: "itGIRL", image: "/images/itgirl.jpg", buttonText: "EXPLORE NOW", link: "/collections/itGIRL" },
    { id: 5, title: "BLUER", image: "/images/bluer.jpg", buttonText: "EXPLORE NOW", link: "/collections/BLUER" },
    { id: 6, title: "OFFDUTY", image: "/images/offduty.jpg", buttonText: "EXPLORE NOW", link: "/collections/OFFDUTY" },
    { id: 7, title: "Urbanic", image: "/images/urbanic.jpg", buttonText: "EXPLORE NOW", link: "/collections/Urbanic" }
  ];

  // Show 3 brands by default, show all when "View All" is clicked
  const visibleFastFashionBrands = showAllFast ? fastFashionBrands : fastFashionBrands.slice(0, 3);
  const visibleLocalGenZBrands = showAllLocal ? localGenZBrands : localGenZBrands.slice(0, 3);

  return (
    <section className="casualwear-section">
      <div className="casualwear-header">
        <h2>TRENDING CASUAL WEAR BRANDS</h2>
        <p>Shop the latest styles from your favorite Gen Z casual fashion labels</p>
      </div>

      {/* Global Fast Fashion Section */}
      <div className="category-header">
        <h3>Global Fast Fashion</h3>
      </div>
      
      <div className="brand-grid">
        {visibleFastFashionBrands.map((brand, index) => (
          <a 
            href={brand.link} 
            className="brand-card" 
            key={brand.id}
            onMouseEnter={() => setHoverIndex(`fast-${index}`)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div className="brand-image-container">
              <img
                src={brand.image}
                alt={brand.title}
                className="brand-image"
                loading="lazy"
              />
              <div className={`brand-overlay ${hoverIndex === `fast-${index}` ? 'active' : ''}`}>
                <div className="brand-content">
                  <span className="brand-category">Global Fashion</span>
                  <h3 className="brand-title">{brand.title}</h3>
                  <span className="brand-cta">{brand.buttonText}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="view-all-container">
        <button onClick={() => setShowAllFast(!showAllFast)} className="view-all-button">
          {showAllFast ? "SHOW LESS" : "VIEW ALL GLOBAL BRANDS"}
        </button>
      </div>

      {/* Local Gen Z Favorites Section */}
      <div className="category-header">
        <h3>Local Gen Z Favorites</h3>
      </div>
      
      <div className="brand-grid">
        {visibleLocalGenZBrands.map((brand, index) => (
          <a 
            href={brand.link} 
            className="brand-card" 
            key={brand.id}
            onMouseEnter={() => setHoverIndex(`local-${index}`)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div className="brand-image-container">
              <img
                src={brand.image}
                alt={brand.title}
                className="brand-image"
                loading="lazy"
              />
              <div className={`brand-overlay ${hoverIndex === `local-${index}` ? 'active' : ''}`}>
                <div className="brand-content">
                  <span className="brand-category">Local Gen Z Favorite</span>
                  <h3 className="brand-title">{brand.title}</h3>
                  <span className="brand-cta">{brand.buttonText}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="view-all-container">
        <button onClick={() => setShowAllLocal(!showAllLocal)} className="view-all-button">
          {showAllLocal ? "SHOW LESS" : "VIEW ALL LOCAL BRANDS"}
        </button>
      </div>
    </section>
  );
};

export default CasualWearBrands;