import React, { useState } from "react";
import "./streetwearCard.scss";
import b1 from "../../assets/jay.webp"
import b2 from "../../assets/huemn.webp"
import b3 from "../../assets/almost.webp"
import b4 from "../../assets/turnt.webp"
import b5 from "../../assets/blu.webp"
import b6 from "../../assets/biskit.webp"
import b7 from "../../assets/drip.jpeg"
import b8 from "../../assets/bomac.webp"
import b9 from "../../assets/blck.webp"
import b10 from "../../assets/eve.webp"
import b11 from "../../assets/future.webp"
import b12 from "../../assets/gen.webp"
import b13 from "../../assets/wtf.jpeg"
import b14 from "../../assets/six.webp"
import b15 from "../../assets/vel.webp"
import b16 from "../../assets/cray.webp"
import b17 from "../../assets/ded.webp"
const StreetWearBrands = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showAllLuxury, setShowAllLuxury] = useState(false);
  const [showAllAffordable, setShowAllAffordable] = useState(false);

  const luxuryBrands = [
    { id: 1, title: "Jaywalking", image: b1, buttonText: "EXPLORE NOW", link: "/collections/Jaywalking" },
    { id: 2, title: "Huemn", image: b2, buttonText: "EXPLORE NOW", link: "/collections/huemn" },
    { id: 3, title: "Almost Gods", image: b3, buttonText: "EXPLORE NOW", link: "/collections/AlmostGods" },
    { id: 4, title: "TurntUp", image: b4, buttonText: "EXPLORE NOW", link: "/collections/TurntUp" },
    { id: 5, title: "BluOrng", image: b5, buttonText: "EXPLORE NOW", link: "/collections/BluOrng" },
    { id: 6, title: "SpaceBiskit", image: b6, buttonText: "EXPLORE NOW", link: "/collections/SpaceBiskit" },
    { id: 7, title: "Drip Project", image: b7, buttonText: "EXPLORE NOW", link: "/collections/DripProject" },
    { id: 8, title: "Bomaachi", image: b8, buttonText: "EXPLORE NOW", link: "/collections/Bomaachi" },
    { id: 9, title: "Blck Orchid", image: b9, buttonText: "EXPLORE NOW", link: "/collections/BlckOrchid" },
    { id: 10, title: "Evemen", image: b10, buttonText: "EXPLORE NOW", link: "/collections/Evemen" }
  ];

  const affordableBrands = [
    { id: 1, title: "Future Saints", image: b11, buttonText: "EXPLORE NOW", link: "/collections/FutureSaints" },
    { id: 2, title: "Genrage", image: b12, buttonText: "EXPLORE NOW", link: "/collections/Genrage" },
    { id: 3, title: "WtFlex", image: b13, buttonText: "EXPLORE NOW", link: "/collections/WtFlex" },
    { id: 4, title: "Six5Six", image: b14, buttonText: "EXPLORE NOW", link: "/collections/Six5Six" },
    { id: 5, title: "Veloce", image: b15, buttonText: "EXPLORE NOW", link: "/collections/Veloce" },
    { id: 6, title: "Crayyheads", image: b16, buttonText: "EXPLORE NOW", link: "/collections/Crayyheads" },
    { id: 7, title: "DeadBear", image: b17, buttonText: "EXPLORE NOW", link: "/collections/DeadBear" }
  ];

  // Show 3 brands by default, show all when "View All" is clicked
  const visibleLuxuryBrands = showAllLuxury ? luxuryBrands : luxuryBrands.slice(0, 3);
  const visibleAffordableBrands = showAllAffordable ? affordableBrands : affordableBrands.slice(0, 3);

  return (
    <section className="streetwear-section">
      <div className="streetwear-header">
        <h2>FEATURED STREETWEAR BRANDS</h2>
        <p>Discover exclusive drops from India's leading streetwear labels</p>
      </div>

      {/* Luxury Streetwear Section */}
      <div className="category-header">
        <h3>Luxury Streetwear</h3>
      </div>
      
      <div className="brand-grid">
        {visibleLuxuryBrands.map((brand, index) => (
          <a 
            href={brand.link} 
            className="brand-card" 
            key={brand.id}
            onMouseEnter={() => setHoverIndex(`luxury-${index}`)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div className="brand-image-container">
              <img
                src={brand.image}
                alt={brand.title}
                className="brand-image"
                loading="lazy"
              />
              <div className={`brand-overlay ${hoverIndex === `luxury-${index}` ? 'active' : ''}`}>
                <div className="brand-content">
                  <span className="brand-category">Luxury Streetwear</span>
                  <h3 className="brand-title">{brand.title}</h3>
                  <span className="brand-cta">{brand.buttonText}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="view-all-container">
        <button onClick={() => setShowAllLuxury(!showAllLuxury)} className="view-all-button">
          {showAllLuxury ? "SHOW LESS" : "VIEW ALL LUXURY BRANDS"}
        </button>
      </div>

      {/* Affordable Premium Streetwear Section */}
      <div className="category-header">
        <h3>Affordable Premium Streetwear</h3>
      </div>
      
      <div className="brand-grid">
        {visibleAffordableBrands.map((brand, index) => (
          <a 
            href={brand.link} 
            className="brand-card" 
            key={brand.id}
            onMouseEnter={() => setHoverIndex(`affordable-${index}`)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <div className="brand-image-container">
              <img
                src={brand.image}
                alt={brand.title}
                className="brand-image"
                loading="lazy"
              />
              <div className={`brand-overlay ${hoverIndex === `affordable-${index}` ? 'active' : ''}`}>
                <div className="brand-content">
                  <span className="brand-category">Affordable Premium</span>
                  <h3 className="brand-title">{brand.title}</h3>
                  <span className="brand-cta">{brand.buttonText}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="view-all-container">
        <button onClick={() => setShowAllAffordable(!showAllAffordable)} className="view-all-button">
          {showAllAffordable ? "SHOW LESS" : "VIEW ALL AFFORDABLE BRANDS"}
        </button>
      </div>
    </section>
  );
};

export default StreetWearBrands;