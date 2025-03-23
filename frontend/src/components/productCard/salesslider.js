import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaSadTear } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useWishlist from "../../hooks/useWishlist";
import OptimizedImage from "../../components/optimizeImage/optimizeImage";
import "./saleSection.scss";

const SaleSection = ({ user }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [menSaleProducts, setMenSaleProducts] = useState({});
  const [womenSaleProducts, setWomenSaleProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { wishlistItems, handleWishlist } = useWishlist(user);
  
  const dispatch = useDispatch();
  
  // Slider scrolling logic
  const sliderRefs = useRef({});
  
  // Define featured categories for men and women (same as in your original code)
  const menCategories = ["tshirts", "hoodies", "sweatshirts", "jeans", "bottoms", "shirts", "accessories"];
  const womenCategories = ["tops", "dresses", "bottoms", "accessories", "skirts", "jeans"];

  const scrollSlider = (category, gender, direction) => {
    const sliderKey = `${gender}-${category}`;
    const slider = sliderRefs.current[sliderKey];
    if (slider) {
      const scrollAmount = direction === 'left' ? -slider.offsetWidth : slider.offsetWidth;
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper functions from your SaleGenderCategoryPage
  const categoryMappingMen = {
    "tshirts": "T-shirts",
    "jeans": "Jeans",
    "jackets": "Jackets",
    // "shirts": "Shirts",
    // "bottoms": "Bottoms",
    // "sweatpants": "SweatPants",
    // "sweatshirts": "Sweatshirts", 
    // "accessories": "Accessories",
    // "sweaters": "Sweaters",
    // "polos": "Polos",
    // "hoodies&sweatshirts": "Hoodies & Sweatshirts",
    // "denim": "Denim",
    // "hoodies": "Hoodies",
    // "jersey": "Jersey"
  };

  const categoryMappingWomen = {
    "bottoms": "Bottoms",
    "dresses": "Dresses",
    // "swimwear": "Swimwear",
    // "accessories": "Accessories",
    "tops": "Tops",
    // "playsuits": "Playsuits",
    // "co-ord-set": "Co-Ord Set", 
    // "sweatshirts": "Sweatshirts",
    // "parachute-pants": "Parachute Pants",
    // "tshirts": "T-shirts",
    // "shirts": "Shirts",
    // "trousers": "Trousers",
    // "jeans": "Jeans",
    // "hoodies&sweatshirts": "Hoodies & Sweatshirts",
    // "shorts": "Shorts",
    // "bodysuits": "Bodysuits",
    // "beachwear": "Beachwear",
    // "corsets": "Corsets",
    // "denim": "Denim",
    // "skirts": "Skirts"
  };

  const getCategoryName = (category, gender) => {
    const mapping = gender === "men" ? categoryMappingMen : categoryMappingWomen;
    return mapping[category.toLowerCase()] || category;
  };

  // Fetch products for home page display - limited to 20 per category
  useEffect(() => {
    const fetchSaleProducts = async () => {
      setIsLoading(true);
      
      try {
        // Fetch men's sale products for each category
        const menProductsPromises = menCategories.map(async (category) => {
          const formattedCategory = getCategoryName(category, "men");
          const response = await fetch(`/api/products?sale=true&gender=men&category=${formattedCategory}&limit=20&sort=newest`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch men's ${category} products`);
          }
          
          const data = await response.json();
          return { category, products: data.products || [] };
        });
        
        // Fetch women's sale products for each category
        const womenProductsPromises = womenCategories.map(async (category) => {
          const formattedCategory = getCategoryName(category, "women");
          const response = await fetch(`/api/products?sale=true&gender=women&category=${formattedCategory}&limit=20&sort=newest`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch women's ${category} products`);
          }
          
          const data = await response.json();
          return { category, products: data.products || [] };
        });
        
        // Wait for all requests to complete
        const menResults = await Promise.all(menProductsPromises);
        const womenResults = await Promise.all(womenProductsPromises);
        
        // Convert arrays to objects for easier access
        const menProductsByCategory = {};
        const womenProductsByCategory = {};
        
        menResults.forEach(({ category, products }) => {
          menProductsByCategory[category] = products;
        });
        
        womenResults.forEach(({ category, products }) => {
          womenProductsByCategory[category] = products;
        });
        
        setMenSaleProducts(menProductsByCategory);
        setWomenSaleProducts(womenProductsByCategory);
      } catch (error) {
        console.error("Error fetching sale products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSaleProducts();
  }, []);

  // Product Item Component - integrating your existing design
  const ProductItem = ({ product, categoryName, gender, index, hoverKey }) => {
    const isWishlisted = wishlistItems.some((item) => item._id === product._id);
    
    return (
      <article 
        className="product-card" 
        key={`${gender}-${categoryName}-${product._id}`}
        onMouseEnter={() => setHoverIndex(hoverKey)}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <div className="product-image-container">
          <OptimizedImage
            src={product.image}
            alt={product.title || "Product Image"}
            className="product-image"
          />
          
          {product.salePrice && product.price && (
            <span className="sale-badge">
              {Math.round((1 - (parseFloat(product.salePrice.replace(/[^\d.]/g, '')) / parseFloat(product.price.replace(/[^\d.]/g, '')))) * 100)}% OFF
            </span>
          )}
          
          <button
            className="wishlist-button"
            onClick={(e) => {
              e.preventDefault();
              handleWishlist(product._id);
            }}
          >
            <FaHeart className={`heart-icon ${isWishlisted ? 'wishlisted' : ''}`} />
          </button>
          
          <div className={`product-overlay ${hoverIndex === hoverKey ? 'active' : ''}`}>
            <div className="product-content">
              <span className="product-category">{gender === 'men' ? "Men's" : "Women's"} {getCategoryName(categoryName, gender)}</span>
              <h3 className="product-title">{product.title || "Untitled Product"}</h3>
              <div className="product-price">
                {product.salePrice && product.salePrice !== "N/A" ? (
                  <>
                    <span className="original-price">{product.price}</span>
                    <span className="sale-price">{product.salePrice}</span>
                  </>
                ) : (
                  <span className="regular-price">{product.price}</span>
                )}
              </div>
              <span className="product-cta">SHOP NOW</span>
            </div>
          </div>
        </div>
        
        <div className="product-info">
          <h2 className="product-title">{product.title || "Untitled Product"}</h2>
          <p className="product-source">{product.source || "Unknown Source"}</p>
          <p className="product-price">
            {product.salePrice && product.salePrice !== "N/A" ? (
              <>
                <span className="original-price">{product.price}</span>
                <span className="sale-price">{product.salePrice}</span>
              </>
            ) : (
              product.price
            )}
          </p>
          <div className="product-actions">
            <a href={product.link} className="product-link" target="_blank" rel="noopener noreferrer">
              View Product
            </a>
          </div>
        </div>
      </article>
    );
  };

  // FaHeart component missing in code sample - defining it here
  const FaHeart = ({ className }) => (
    <svg 
      className={className} 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
    </svg>
  );

  // CategorySlider Component - modified to match your design
  const CategorySlider = ({ gender, category, products = [] }) => {
    // Only render if we have products
    if (!products || products.length === 0) {
      if (!isLoading) {
        return (
          <div className="category-section">
            <div className="category-header">
              <h4>{getCategoryName(category, gender)}</h4>
            </div>
            <div className="no-results">
              <FaSadTear className="sad-icon" />
              <p className="no-results-text">
                Oops! No {getCategoryName(category, gender)} for sale right now. <br /> 
                Check back later for fresh deals!
              </p>
            </div>
          </div>
        );
      }
      
      // Show skeleton loaders while loading
      return (
        <div className="category-section">
          <div className="category-header">
            <h4>{getCategoryName(category, gender)}</h4>
          </div>
          <div className="product-slider">
            {[...Array(4)].map((_, index) => (
              <div className="product-card skeleton" key={`skeleton-${gender}-${category}-${index}`}>
                <div className="product-image-container">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-details">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-price"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const sliderKey = `${gender}-${category}`;
    
    return (
      <div className="category-section">
        <div className="category-header">
          <h4>{getCategoryName(category, gender)}</h4>
          {products.length > 4 && (
            <div className="slider-controls">
              <button 
                className="slider-control prev" 
                onClick={() => scrollSlider(category, gender, 'left')}
                aria-label="Previous items"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="slider-control next" 
                onClick={() => scrollSlider(category, gender, 'right')}
                aria-label="Next items"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
        
        <div 
          className="product-slider" 
          ref={el => sliderRefs.current[sliderKey] = el}
        >
          {products.map((product, index) => (
            <ProductItem 
              key={`${gender}-${category}-${product._id}-${index}`}
              product={product}
              categoryName={category}
              gender={gender}
              index={index}
              hoverKey={`${gender}-${category}-${index}`}
            />
          ))}
        </div>
        
        <div className="view-all-container">
          <Link to={`/collections/${gender}-sale/${category}`} className="view-all-button">
            VIEW ALL {gender.toUpperCase()}'S {getCategoryName(category, gender).toUpperCase()} SALE
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section className="sale-section">
      <div className="sale-header">
        <h2>ON SALE NOW</h2>
        <p>Limited time discounts on trending Gen Z styles</p>
      </div>

      {/* Women's Sale Categories */}
      <div className="gender-sale-section">
        <div className="gender-header">
          <h3>Women's Sale</h3>
        </div>
        
        {womenCategories.map(category => (
          <CategorySlider
            key={`women-${category}`}
            gender="women"
            category={category}
            products={womenSaleProducts[category] || []}
          />
        ))}
        
        <div className="view-all-container main-view-all">
          <Link to="/collections/women-sale" className="view-all-button">
            VIEW ALL WOMEN'S SALE
          </Link>
        </div>
      </div>

      {/* Men's Sale Categories */}
      <div className="gender-sale-section">
        <div className="gender-header">
          <h3>Men's Sale</h3>
        </div>
        
        {menCategories.map(category => (
          <CategorySlider
            key={`men-${category}`}
            gender="men"
            category={category}
            products={menSaleProducts[category] || []}
          />
        ))}
        
        <div className="view-all-container main-view-all">
          <Link to="/collections/men-sale" className="view-all-button">
            VIEW ALL MEN'S SALE
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SaleSection;