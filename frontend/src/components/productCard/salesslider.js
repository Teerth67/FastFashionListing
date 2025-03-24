import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight, FaSadTear, FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useWishlist from "../../hooks/useWishlist";
import OptimizedImage from "../optimizeImage/optimizeImage";
import { fetchProductsApi } from "../../redux/features/products/productApi";
import "./saleSection.scss";

const SaleSection = () => {
  const [menSaleProducts, setMenSaleProducts] = useState({});
  const [womenSaleProducts, setWomenSaleProducts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user);

  // Define featured categories for men and women
  const menCategories = ["T-shirts", "Sweatshirts", "Jeans"];
  const womenCategories = ["Tops", "Dresses", "Bottoms"];

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Category mapping functions
  const categoryMappingMen = {
    "t-shirts": "T-shirts",
    jeans: "Jeans",
    jackets: "Jackets",
    sweatshirts: "Sweatshirts",
    hoodies: "Hoodies",
    jersey: "Jersey",
  };

  const categoryMappingWomen = {
    bottoms: "Bottoms",
    dresses: "Dresses",
    tops: "Tops",
  };

  const getCategoryName = (category, gender) => {
    const mapping = gender === "men" ? categoryMappingMen : categoryMappingWomen;
    return mapping[category.toLowerCase()] || category;
  };

  // Fetch sale products (limited to 20 per category)
  useEffect(() => {
    const fetchSaleProducts = async () => {
      setIsLoading(true);
      try {
        const fetchCategoryProducts = async (category, gender) => {
          const formattedCategory = getCategoryName(category, gender);
          try {
            const result = await fetchProductsApi({
              gender,
              category: formattedCategory,
              sale: true,
              limit: 20,
              sort: "newest",
            });
            return { category, products: result.products || [] };
          } catch (error) {
            console.error(`Failed to fetch ${gender}'s ${category} products:`, error);
            return { category, products: [] };
          }
        };

        const menResults = await Promise.all(
          menCategories.map((cat) => fetchCategoryProducts(cat, "men"))
        );
        const womenResults = await Promise.all(
          womenCategories.map((cat) => fetchCategoryProducts(cat, "women"))
        );

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

  const extractNumber = (price) => {
    if (typeof price === "number") return price;
    // Handle null or undefined
    if (!price) return 0;
    // Remove currency symbols, spaces, and commas - handle "RS" in any case format
    const cleanedPrice = price.toString().replace(/rs\.?|₹|\s|,/gi, "").trim();
    return parseFloat(cleanedPrice) || 0;
  };
    
  // Product Item Component - Modified to remove hover effect
  const ProductItem = ({ product, categoryName, gender }) => {
    const isWishlisted = wishlistItems.some((item) => item._id === product._id);

    return (
      <article className="product-card">
         <a href={product.link} target="_blank" rel="noopener noreferrer" className="product-link-wrapper">
        <div className="product-image-container">
          <OptimizedImage
            src={product.image}
            alt={product.title || "Product Image"}
            className="product-image"
          />
            {product.salePrice && product.price && (
              <span className="sale-badge">
                {Math.round(
                  (1 - (extractNumber(product.salePrice) / extractNumber(product.price))) * 100
                )}
                % OFF
              </span>
            )}
            <button
              className="wishlist-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlist(product._id);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart className={`heart-icon ${isWishlisted ? "wishlisted" : ""}`} />
            </button>

            {/* Display product info directly on image for all devices */}
            <div className="product-info-overlay">
              <div className="product-content">
                <span className="product-category">
                  {gender === "men" ? "Men's" : "Women's"} {getCategoryName(categoryName, gender)}
                </span>
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
              </div>
            </div>
          </div>
        </a>
      </article>
    );
  };

  // Revised CategorySlider Component with improved slider logic
  const CategorySlider = ({ gender, category, products = [], isLoading }) => {
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Simplified approach to determine visible items
    const getVisibleItems = () => {
      const width = window.innerWidth;
      if (width <= 480) return 1;
      if (width <= 768) return 2;
      if (width <= 1024) return 3;
      return 4;
    };
    
    const visibleItems = getVisibleItems();
    
    // Simple scroll functions
    const scrollLeft = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };
    
    const scrollRight = () => {
      if (currentIndex < products.length - visibleItems) {
        setCurrentIndex(currentIndex + 1);
      }
    };
    
    // Calculate slider position
    useEffect(() => {
      if (sliderRef.current) {
        const itemWidth = sliderRef.current.querySelector(".product-card")?.offsetWidth || 0;
        const gap = 16; // Gap between items
        sliderRef.current.style.transform = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
      }
    }, [currentIndex]);
    
    // Window resize handler
    useEffect(() => {
      const handleResize = () => {
        // Reset to first item on resize to avoid empty spaces
        setCurrentIndex(0);
        
        // Reset transform
        if (sliderRef.current) {
          sliderRef.current.style.transform = 'translateX(0)';
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    // Handle no products case
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
                No {getCategoryName(category, gender)} on sale right now.
              </p>
            </div>
          </div>
        );
      }
      // Return loading skeletons
      return (
        <div className="category-section">
          <div className="category-header">
            <h4>{getCategoryName(category, gender)}</h4>
          </div>
          <div className="product-slider-container">
            <div className="product-slider">
              {[...Array(4)].map((_, index) => (
                <div className="product-card skeleton" key={`skeleton-${index}`}>
                  <div className="skeleton-image"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="category-section">
        <div className="category-header">
          <h4>{getCategoryName(category, gender)}</h4>
          {products.length > visibleItems && (
            <div className="slider-controls">
              <button
                className={`slider-control prev ${currentIndex === 0 ? "disabled" : ""}`}
                onClick={scrollLeft}
                aria-label="Previous items"
                disabled={currentIndex === 0}
              >
                <FaChevronLeft />
              </button>
              <button
                className={`slider-control next ${
                  currentIndex >= products.length - visibleItems ? "disabled" : ""
                }`}
                onClick={scrollRight}
                aria-label="Next items"
                disabled={currentIndex >= products.length - visibleItems}
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
        <div className="product-slider-container">
          <div 
            className="product-slider" 
            ref={sliderRef}
            style={{
              transition: 'transform 0.3s ease',
              display: 'flex',
              width: '100%'
            }}
          >
            {products.map((product, index) => (
              <ProductItem
                key={`${gender}-${category}-${index}`}
                product={product}
                categoryName={category}
                gender={gender}
              />
            ))}
          </div>
        </div>
        <div className="view-all-container">
          <Link to={`/sales/${gender}/${category}`} className="view-all-button">
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
        {womenCategories.map((category) => (
          <CategorySlider
            key={`women-${category}`}
            gender="women"
            category={category}
            products={womenSaleProducts[category] || []}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Men's Sale Categories */}
      <div className="gender-sale-section">
        <div className="gender-header">
          <h3>Men's Sale</h3>
        </div>
        {menCategories.map((category) => (
          <CategorySlider
            key={`men-${category}`}
            gender="men"
            category={category}
            products={menSaleProducts[category] || []}
            isLoading={isLoading}
          />
        ))}
      </div>
    </section>
  );
};

export default SaleSection;