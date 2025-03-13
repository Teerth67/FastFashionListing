
import React, { useState, useEffect } from "react";
import styles from "./Dropdown.module.scss"; 

const menuItems = [
  {
    title: "All Collections",
    path: "/collections",
    subcategories: [
      { name: "Jaywalking", path: "/collections/Jaywalking" },
      { name: "Veloce", path: "/collections/Veloce" },

      { name: "Huemn", path: "/collections/huemn" },
      { name: "Almost Gods", path: "/collections/AlmostGods" },
      { name: "TurntUp", path: "/collections/TurntUp" },
      { name: "Outcasts", path: "/collections/Outcasts" },
      { name: "BluOrng", path: "/collections/BluOrng" },
      { name: "SpaceBiskit", path: "/collections/SpaceBiskit" },
      { name: "WtFlex", path: "/collections/WtFlex" },
      { name: "Six5Six", path: "/collections/Six5Six" },
      { name: "Drip Project", path: "/collections/DripProject" },
      { name: "Bluer", path: "/collections/Bluer" },
      
      { name: "Bomaachi", path: "/collections/Bomaachi" },
      { name: "Blck Orchid", path: "/collections/BlckOrchid" },
      { name: "Future Saints", path: "/collections/FutureSaints" },
      { name: "Warping Theories", path: "/collections/WarpingTheories" },
      {name:"DeadBear",path:"/collections/DeadBear"},
      {name:"Evemen",path:"/collections/Evemen"},
      {name:"Genrage",path:"/collections/Genrage"},
      {name:"Beeglee",path:"/collections/Beeglee"},
      {name:"Merche",path:"/collections/themerche"},
     {name:"It-Girl",path:"/collections/ItGirl"},
     {name:"The Dapper Lady",path:"/collections/TheDapperLady"}
    ],
  },
  {
    title: "Ladies",
    path: "/women",
    subcategories: [
      { name: "Bottoms", path: "/women/bottoms" },
      { name: "Dresses", path: "/women/dresses" },

      { name: "Accessories", path: "/women/accessories" },
      { name: "Tops", path: "/women/tops" },
      // { name: "Playsuits", path: "/women/playsuits" },
      { name: "Co-Ord Set", path: "/women/co-ord-set" },
      { name: "Sweatshirts", path: "/women/sweatshirts" },
      // { name: "Parachute Pants", path: "/women/parachute-pants" },
      { name: "T-shirts", path: "/women/t-shirts" },
      { name: "Shirts", path: "/women/shirts" },
      // { name: "Trousers", path: "/women/trousers" },
      { name: "Jeans", path: "/women/jeans" },
       { name: "Hoodies & Sweatshirts", path: "/women/hoodies-sweatshirts" },
      { name: "Shorts", path: "/women/shorts" },
      { name: "Bodysuits", path: "/women/bodysuits" },
      { name: "Denim", path: "/women/denim" },
      { name: "Skirts", path: "/women/skirts" },
      {name:"Corsets",path:"/women/corsets"},
      {name:"Beachwear",path:"/women/beachwear"},
    ],
  },
  {
    title: "Men",
    path: "/men",
    subcategories: [
      { name: "T-shirts", path: "/men/tshirts" },
      { name: "Polos", path: "/men/polos" },
      { name: "Jeans", path: "/men/jeans" },
      { name: "Jackets", path: "/men/jackets" },
      { name: "Shirts", path: "/men/shirts" },
      { name: "Bottoms", path: "/men/bottoms" },
      { name: "SweatPants", path: "/men/sweatpants" },
      { name: "Sweatshirts", path: "/men/sweatshirts" },
      { name: "Accessories", path: "/men/accessories" },
      { name: "Hoodies", path: "/men/hoodies" },
      { name: "Denim", path: "/men/denim" },
      { name: "Jersey", path: "/men/jersey" },
    ],
  },
  {
    title: "Sale",
    path: "/sale",
    subcategories: [
      {
        name: "Men",
        path: "/sale/men",
        subcategories: [
          { name: "T-shirts", path: "/sales/men/tshirts" },
          { name: "Polos", path: "/sales/men/polos" },
          { name: "Jeans", path: "/sales/men/jeans" },
          { name: "Jackets", path: "/sales/men/jackets" },
          { name: "Shirts", path: "/sales/men/shirts" },
          { name: "Bottoms", path: "/sales/men/bottoms" },
          { name: "SweatPants", path: "/sales/men/sweatpants" },
          { name: "Sweatshirts", path: "/sales/men/sweatshirts" },
          { name: "Accessories", path: "/sales/men/accessories" },
          { name: "Hoodies", path: "/sales/men/hoodies" },
          { name: "Denim", path: "/sales/men/denim" },
          { name: "Jersey", path: "/sales/men/jersey" },
        ],
      },
      {
        name: "Women",
        path: "/sales/women",
        subcategories: [
          { name: "Bottoms", path: "/sales/women/bottoms" },
          { name: "Dresses", path: "/sales/women/dresses" },
          {name:"Beachwear",path:"/sales/women/beachwear"},

          { name: "Accessories", path: "/sales/women/accessories" },
          { name: "Tops", path: "/sales/women/tops" },
          // { name: "Playsuits", path: "/sales/women/playsuits" },
          { name: "Co-Ord Set", path: "/sales/women/co-ord-set" },
          { name: "Sweatshirts", path: "/sales/women/sweatshirts" },
          { name: "T-shirts", path: "/sales/women/t-shirts" },
          { name: "Shirts", path: "/women/shirts" },
          { name: "Jeans", path: "/sales/women/jeans" },
          { name: "Hoodies & Sweatshirts", path: "/women/hoodies-sweatshirts" },
      // { name: "Shorts", path: "/sales/women/shorts" },
      { name: "Bodysuits", path: "/sales/women/bodysuits" },
      { name: "Denim", path: "/sales/women/denim" },
      // { name: "Skirts", path: "/sales/women/skirts" },
      { name: "Shorts", path: "/sales/women/shorts" },
      // { name: "Bodysuits", path: "/sales/women/bodysuits" },
      // { name: "Denim", path: "/sales/women/denim" },
      { name: "Skirts", path: "/sales/women/skirts" },
      
      
      // { name: "Parachute Pants", path: "/sales/women/parachute-pants" },
      // { name: "Parachute Pants", path: "/sales/women/parachute-pants" },
     
    
        ],
      },
    ],
  },
];
const DropdownMenu = ({ isMobileOpen }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // This effect resets dropdowns when the mobile menu is closed
  useEffect(() => {
    // Check if mobile menu is closed (false)
    if (isMobileOpen === false) {
      setActiveMobileCategory(null);
    }
  }, [isMobileOpen]);

  const handleNavigation = (path) => {
    window.location.href = path; // Force a full page reload
  };

  const handleMobileCategoryClick = (e, item) => {
    // Stop event propagation to prevent the link from being followed
    e.stopPropagation();
    setActiveMobileCategory(activeMobileCategory?.title === item.title ? null : item);
  };

  const renderSaleSubcategories = (subcategories) => (
    <div className={styles.dropdownContent + " " + (isMobile ? styles.mobileDropdown : "")}
         data-mobile-active={isMobile && activeMobileCategory?.title === "Sale"}>
      <div className={styles.saleGrid}>
        {subcategories.map((gender, index) => (
          <div key={index} className={styles.genderSection}>
            <h3 className={styles.genderTitle}>{gender.name}</h3>
            <div className={styles.subcategoriesGrid}>
              {gender.subcategories.map((item, idx) => (
                <div key={idx} className={styles.subcategory} 
                     onClick={() => handleNavigation(item.path)}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRegularSubcategories = (subcategories, category) => (
    <div className={styles.dropdownContent + " " + (isMobile ? styles.mobileDropdown : "")}
         data-mobile-active={isMobile && activeMobileCategory?.title === category}
         data-category={category}>
      <div className={styles.subcategoriesGrid}>
        {subcategories.map((subcategory, index) => (
          <div key={index} className={styles.subcategory} 
               onClick={() => handleNavigation(subcategory.path)}>
            {subcategory.name}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.menuContainer} onMouseLeave={() => !isMobile && setActiveCategory(null)}>
      <div className={styles.categoryRow}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={styles.categoryContainer}
            onMouseEnter={!isMobile ? () => setActiveCategory(item) : undefined}
          >
            <div className={styles.categoryHeader}>
              <a
          href={item.path}
          className={styles.category}
          onClick={(e) => {
            if (isMobile) {
              // Only prevent default if clicking on the entire area when subcategories are showing
              if (activeMobileCategory?.title === item.title) {
                e.preventDefault();
              } else {
                // Navigate to the page when clicking on the link text
                handleNavigation(item.path);
              }
            }
          }}
        >
          {item.title}
        </a>
              {isMobile && (
                <button
                  className={styles.arrowButton + " " + 
                    (activeMobileCategory?.title === item.title ? styles.arrowActive : "")}
                  onClick={(e) => handleMobileCategoryClick(e, item)}
                >
                  ▼
                </button>
              )}
            </div>

            {(activeCategory?.title === item.title || 
             (isMobile && activeMobileCategory?.title === item.title)) && (
              item.title === "Sale" 
                ? renderSaleSubcategories(item.subcategories)
                : renderRegularSubcategories(item.subcategories, item.title)
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
