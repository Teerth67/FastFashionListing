import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts, setSort } from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/loader/Loader";
import styles from "../collections/Collections.module.scss";
import OptimizedImage from "../../components/optimizeImage/optimizeImage";
import { isValidCollection } from "../../utils/routevalidation";

// ✅ Mapping UI names to database names
const brandNameMapping = {
  "Jaywalking": "Jaywalking",
  "Veloce": "Veloce",
  "H&M": "H&M",
  "Huemn": "HUEMN",
  "Almost Gods": "Almost Gods",
  "TurntUp": "TURNT",
  "Outcasts": "outcasts",
  "BluOrng": "BluOrng",
  "Space Biskit": "SpaceBiskit",
  "WtFlex": "wtflex",
  "Six5Six": "six5sixstreet",
  "Drip Project": "Drip Project",
  "Bluer": "Bluer",
  "Bomaachi": "Bomaachi",
  "Blck Orchid": "Blck Orchid",
  "Future Saints": "Future Saints",
  "Warping Theories": "WarpingTheories",
  "DaysforClothing": "DaysforClothing",
  "Crayyheads": "Crayyheads",
  "ItGirl": "ItGirl",
  "TheDapperLady": "DapperLady",
  "Evemen":"Evemen",
  "DeadBear":"Deadbear",
  "Genrage":"Genrage",
  "Crayyheads":"Crayyheads",
  "themerche":"themerche",
  "Beeglee":"Beeglee",
};

const getDatabaseName = (slug) => {
  if (!slug) return "";

  let decodedSlug = decodeURIComponent(slug);


  // ✅ Special case for "H&M" handling
  if (decodedSlug.toLowerCase() === "hm" || decodedSlug.toLowerCase() === "h&m") {
    
    return "H&M";
  }

  // ✅ Direct match before formatting
  if (brandNameMapping[decodedSlug]) {

    return brandNameMapping[decodedSlug];
  }

  // ✅ Convert camelCase or PascalCase to spaced words
  const spacedName = decodedSlug.replace(/([a-z])([A-Z])/g, "$1 $2");

  // ✅ Capitalize first letter of each word
  const formattedName = spacedName
    .replace(/-/g, " ") // Convert hyphens to spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
    .trim();


  const finalName = brandNameMapping[formattedName] || formattedName;


  return finalName;
};

const BrandCollections = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { source, gender } = useParams();
  const databaseName = getDatabaseName(source); // Convert to DB name
  const { filteredItems: products, status, error, page, hasMore, sort } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  // ✅ Use custom wishlist hook
  const { wishlistItems, handleWishlist } = useWishlist(user);

  // Track if initial load has happened
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const prevDatabaseNameRef = useRef(databaseName);
  const prevGenderRef = useRef(gender);
  const prevSortRef = useRef(sort);
  useEffect(() => {
    // Validate collection/brand
    if (source && !isValidCollection(source)) {
      // console.error(`Invalid collection: ${source}`);
      navigate("/404"); // Redirect to 404 page or homepage
      return;
    }


  }, [source, navigate]);
  useEffect(() => {
    const databaseNameChanged = prevDatabaseNameRef.current !== databaseName;
    const genderChanged = prevGenderRef.current !== gender;
    
    // Only reset and fetch if this is the first load OR parameters changed
    if (!initialLoadDone || databaseNameChanged || genderChanged) {
      // Update refs
      prevDatabaseNameRef.current = databaseName;
      prevGenderRef.current = gender;
      
      // console.log(`Fetching products: source=${databaseName}, gender=${gender}, initialLoad=${!initialLoadDone}`);
      
      dispatch(resetProducts());
      if (!sort) dispatch(setSort("newest"));
      dispatch(fetchProductsByCollection({ source: databaseName, gender, page: 1, sort: sort || "newest" }));
      
      if (!initialLoadDone) {
        setInitialLoadDone(true);
      }
    }
  }, [dispatch, databaseName, gender, initialLoadDone, sort]);

  // Track sort changes separately to avoid conflicts with the main effect
  useEffect(() => {
    if (initialLoadDone && prevSortRef.current !== sort && sort) {
      prevSortRef.current = sort;
      // console.log(`Sort changed to ${sort}, refetching products`);
      
      dispatch(resetProducts());
      dispatch(fetchProductsByCollection({ source: databaseName, gender, page: 1, sort }));
    }
  }, [dispatch, sort, databaseName, gender, initialLoadDone]);

  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    // console.log(`Fetching next page: ${page}, source=${databaseName}, gender=${gender}, sort=${sort}`);
    dispatch(fetchProductsByCollection({ gender, source: databaseName, page, sort }));
  }, [status, dispatch, page, hasMore, gender, databaseName, sort]);

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
    const newSort = e.target.value;
    dispatch(setSort(newSort));
    // No need to manually reset or fetch here - the useEffect will handle it
  };

  if (status === "loading" && page === 1) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {typeof error === "object" ? error.message || "An error occurred" : error}
      </div>
    );
  }

  // Deduplicate products by ID to prevent repeats
  const uniqueProducts = Array.isArray(products) 
    ? [...new Map(products.map(product => [product._id, product])).values()]
    : [];

  return (
    
    <div className={styles.collectionsPage}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          {databaseName || "All"} Collection
        </h1>
        
        <div className={styles.sortContainer}>
          <span className={styles.sortLabel}>Sort By:</span>
          <select className={styles.sortDropdown} value={sort} onChange={handleSortChange}>
            <option value="newest">Latest</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className={styles.productsGrid}>
        {uniqueProducts.map((product, index) => (
          <article className={styles.productCard} key={product._id} ref={index === uniqueProducts.length - 1 ? lastProductRef : null}>
            <div className={styles.productImage}>
              {product.image ? (
                <OptimizedImage src={product.image} alt={product.title} />
              ) : (
                <div className={styles.imagePlaceholder}>Image Not Available</div>
              )}

              <button
                className={styles.wishlistButton}
                onClick={() => handleWishlist(product._id)}
                aria-label={wishlistItems.some((item) => item._id === product._id) ? "Remove from wishlist" : "Add to wishlist"}
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
                    <span className={styles.originalPrice}>{product.price}</span>
                    <span className={styles.salePrice}>{product.salePrice}</span>
                  </>
                ) : (
                  product.price
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
      {error && <p className={styles.error}>{typeof error === "object" ? error.message || "An error occurred" : error}</p>}
    </div>
  );
};

export default BrandCollections;