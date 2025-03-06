import React, { useEffect, useRef, useCallback ,useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts, setSort } from "../../redux/features/products/productSlice";
import { FaHeart,FaSadTear } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/loader/Loader";
import styles from "../collections/Collections.module.scss";
import OptimizedImage from "../../components/optimizeImage/optimizeImage";
import { isValidGender, isValidMenCategory, isValidWomenCategory } from "../../utils/routevalidation";

const categoryMappingMen = {
  "tshirts": "T-shirts",
  "jeans": "Jeans",
  "jackets": "Jackets",
  "shirts": "Shirts",
  "bottoms": "Bottoms",
  "sweatpants": "SweatPants",
  "sweatshirts": "Sweatshirts",
  "accessories": "Accessories",
  "sweaters": "Sweaters",
  "polos": "Polos",
  "hoodies&sweatshirts": "Hoodies & Sweatshirts",
  "denim": "Denim",
  "hoodies": "Hoodies",
  "jersey": "Jersey"
};

const categoryMappingWomen = {
  "bottoms": "Bottoms",
  "dresses": "Dresses",
  "swimwear": "Swimwear",
  "accessories": "Accessories",
  "tops": "Tops",
  "playsuits": "Playsuits",
  "co-ord-set": "Co-Ord Set",
  "sweatshirts": "Sweatshirts",
  "parachute-pants": "Parachute Pants",
  "tshirts": "T-shirts",
  "shirts": "Shirts",
  "trousers": "Trousers",
  "jeans": "Jeans",
  "hoodies&sweatshirts": "Hoodies & Sweatshirts",
  "shorts": "Shorts",
  "bodysuits": "Bodysuits",
  "beachwear":"Beachwear",
  "corsets":"Corsets",
  "denim": "Denim",
  "skirts": "Skirts"
};

const getCategoryName = (category, gender) => {
  const mapping = gender === "men" ? categoryMappingMen : categoryMappingWomen;
  return mapping[category.toLowerCase()] || category;
};


const SaleGenderCategoryPage = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { gender, category } = useParams();
  const formattedCategory = getCategoryName(category, gender);

  const { filteredItems: products, status, error, page, hasMore, sort } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user);
// Add these at the beginning of your component
const [initialLoadDone, setInitialLoadDone] = useState(false);
const prevSortRef = useRef(sort);
useEffect(() => {
  if (!isValidGender(gender)) {
    navigate("/404"); // Redirect if gender is invalid
    return;
  }

  // Check category validation based on gender
  if (
    (gender === "men" && !isValidMenCategory(formattedCategory)) ||
    (gender === "women" && !isValidWomenCategory(formattedCategory))
  ) {
    navigate("/404"); // Redirect if category is invalid
    return;
  }
}, [formattedCategory, gender, navigate]);

// Replace your existing useEffect with these two separate ones
// Replace your existing SaleGenderCategoryPage useEffect blocks with this:
useEffect(() => {
  // Only reset and fetch if this is the first load
  if (!initialLoadDone) {
    dispatch(resetProducts());
    
    // Only set default sort if it doesn't exist already
    if (!sort) dispatch(setSort("newest"));
    
    dispatch(fetchProductsByCollection({ 
      sale: true, 
      gender, 
      category: formattedCategory, 
      page: 1, 
      sort: sort || "newest" 
    }));
    setInitialLoadDone(true);
  }
}, [dispatch, initialLoadDone, gender, formattedCategory, sort]);

// Keep your second useEffect for tracking sort changes as is
useEffect(() => {
  if (initialLoadDone && prevSortRef.current !== sort && sort) {
    prevSortRef.current = sort;
    
    dispatch(resetProducts());
    dispatch(fetchProductsByCollection({ 
      sale: true, 
      gender, 
      category: formattedCategory, 
      page: 1, 
      sort 
    }));
  }
}, [dispatch, sort, initialLoadDone, gender, formattedCategory]);
  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    dispatch(fetchProductsByCollection({sale: true, gender, category: formattedCategory, page, sort }));
  }, [status, dispatch, page, hasMore, gender, formattedCategory, sort]);

  const observer = useRef();
  const lastProductRef = useCallback((node) => {
    if (status === "loading" || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage]);

  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
  };

  // const formatPrice = (price) => {
  //   if (!price) return "N/A";
  //   return typeof price === "number"
  //     ? `Rs ${price.toLocaleString()}`
  //     : price.toString().replace("Rs.", "Rs ").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  // };

  if (status === "loading" && page === 1) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error.message || "An error occurred"}</div>;
  }

 
  return (
    <div className={styles.collectionsPage}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Sale - {formattedCategory} ({gender})</h1>
        <div className={styles.sortContainer}>
          <span className={styles.sortLabel}>Sort By:</span>
          <select className={styles.sortDropdown} value={sort} onChange={handleSortChange}>
            <option value="newest">Latest</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </div>
      </div>
  
      {products.length === 0 && status!=="loading" && (
        <div className={styles.noResults}>
          <FaSadTear className={styles.sadIcon} />
          <p className={styles.noResultsText}>
            Oops! No {formattedCategory} for sale right now. <br /> Check back later for fresh deals!
          </p>
        </div>
      )}
  
      <div className={styles.productsGrid}>
        {Array.isArray(products) &&
          products.map((product, index) => (
            <article
              className={styles.productCard}
              key={product._id}
              ref={index === products.length - 1 ? lastProductRef : null}
            >
              <div className={styles.productImage}>
                <OptimizedImage src={product.image} alt={product.title} />
                <button
                  className={styles.wishlistButton}
                  onClick={() => handleWishlist(product._id)}
                >
                  <FaHeart
                    className={`${styles.heartIcon} ${wishlistItems.some((item) => item._id === product._id) ? styles.wishlisted : ""}`}
                  />
                </button>
              </div>
              <div className={styles.productInfo}>
                <h2 className={styles.productTitle}>{product.title || "Untitled Product"}</h2>
                <p className={styles.productSource}>{product.source || "Unknown Source"}</p>
                <p className={styles.productPrice}>
                  {product.salePrice && product.salePrice !== "N/A" ? (
                    <>
                      <span className={styles.originalPrice}>{(product.price)}</span>
                      <span className={styles.salePrice}>{(product.salePrice)}</span>
                    </>
                  ) : (
                    (product.price)
                  )}
                </p>
                <div className={styles.productActions}>
                  <a href={product.link} className={styles.productLink} target="_blank" rel="noopener noreferrer">
                    View Product
                  </a>
                </div>
              </div>
            </article>
          ))}
      </div>
  
      {status === "loading" && page > 1 && (
                <div className={styles.loading}>
                  <div className={styles.loadingSpinner}></div>
                  </div>
      )}
      {error && <p className={styles.error}>{error.message || "An error occurred"}</p>}
    </div>
  );
  
};

export default SaleGenderCategoryPage;
