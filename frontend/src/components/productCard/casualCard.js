import React, { useState } from "react";
import "./casualwearCard.scss";
import b1 from "../../assets/wrap.webp"
import b2 from "../../assets/out.webp"
import b3 from "../../assets/it.webp"
import b4 from "../../assets/bluer.webp"
import b5 from "../../assets/dap.webp"
import b6 from "../../assets/bee.webp"
const CasualWearBrands = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const casualBrands = [
    { id: 1, title: "Warping Theories", category: "Indie Casual", image: b1, link: "/collections/WarpingTheories" },
    { id: 2, title: "Outcasts", category: "Alternative Casual", image: b2, link: "/collections/Outcasts" },
    { id: 3, title: "It Girl", category: "Contemporary Casual", image: b3, link: "/collections/ItGirl" },
    { id: 4, title: "Bluer", category: "Minimalist Casual", image:b4, link: "/collections/Bluer" },
    { id: 5, title: "The Dapper Lady", category: "Elegant Casual", image: b5, link: "/collections/DappingLady" },
    { id: 6, title: "Beegle", category: "Playful Casual", image: b6, link: "/collections/Beegle" }
  ];

  const visibleBrands = showAll ? casualBrands : casualBrands.slice(0, 3);

  return (
    <section className="casualwear-section">
      <div className="casualwear-header">
        <h2>TRENDING CASUAL BRANDS</h2>
        <p>Discover the best in contemporary casual fashion</p>
      </div>

      <div className="brand-grid">
        {visibleBrands.map((brand, index) => (
          <a
            href={brand.link}
            className="brand-card"
            key={brand.id}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div className="brand-image-container">
              <img
                src={brand.image}
                alt={brand.title}
                className="brand-image"
                loading="lazy"
              />
              <div className={`brand-overlay ${hoverIndex === index ? 'active' : ''}`}>
                <div className="brand-content">
                  <span className="brand-category">{brand.category}</span>
                  <h3 className="brand-title">{brand.title}</h3>
                  <span className="brand-cta">EXPLORE NOW</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="view-all-container">
        <button onClick={() => setShowAll(!showAll)} className="view-all-button">
          {showAll ? "SHOW LESS" : "VIEW ALL BRANDS"}
        </button>
      </div>
    </section>
  );
};

export default CasualWearBrands;
