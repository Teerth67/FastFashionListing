import React, { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts, setSort } from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/loader/Loader";
import Filter from "../../components/Filter/filtermodule"; // Import the Filter component
import styles from "./Collections.module.scss";
import OptimizedImage from "../../components/optimizeImage/optimizeImage";

const Collections = () => {
  const dispatch = useDispatch();
  const { source, gender } = useParams();
  const { filteredItems: products, status, error, page, hasMore, sort, filters } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user);
  
  // Track if initial load has happened
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const prevSourceRef = useRef(source);
  const prevGenderRef = useRef(gender);
  const prevSortRef = useRef(sort);
  const prevFiltersRef = useRef(filters);

  // Initial load and parameter changes
  useEffect(() => {
    const sourceChanged = prevSourceRef.current !== source;
    const genderChanged = prevGenderRef.current !== gender;
    const sortChanged = prevSortRef.current !== sort;
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

    // Only reset and fetch if this is the first load OR parameters changed
    if (!initialLoadDone || sourceChanged || genderChanged || sortChanged || filtersChanged) {
      // Update refs
      prevSourceRef.current = source;
      prevGenderRef.current = gender;
      prevSortRef.current = sort;
      prevFiltersRef.current = filters;
      
      // Reset and fetch products with the new parameters
      dispatch(resetProducts());
      dispatch(fetchProductsByCollection({ 
        source, 
        gender, 
        page: 1, 
        sort,
        ...filters // Include filters in the fetch request
      }));
      
      if (!initialLoadDone) {
        setInitialLoadDone(true);
      }
    }
  }, [dispatch, source, gender, sort, filters, initialLoadDone]);

  // Infinite scroll logic - fetch next page
  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    
    dispatch(fetchProductsByCollection({ 
      gender, 
      source, 
      page, 
      sort,
      ...filters // Include filters in the fetch request
    }));
  }, [status, dispatch, page, hasMore, gender, source, sort, filters]);

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

  // Handle sorting change
  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
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
          {source || "All"} Collection{gender ? ` - ${gender}` : ""}
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

      <div className={styles.productLayout}>
        <div className={styles.filterSidebar}>
          <Filter />
        </div>
        
        <div className={styles.productsContainer}>
          {uniqueProducts.length === 0 && status !== "loading" ? (
            <div className={styles.noResults}>
              <div className={styles.sadIcon}>😢</div>
              <p className={styles.noResultsText}>No products found matching your criteria.</p>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {uniqueProducts.map((product, index) => (
                <article
                  className={styles.productCard}
                  key={product._id}
                  ref={index === uniqueProducts.length - 1 ? lastProductRef : null}
                >
                  <div className={styles.productImage}>
                    {product.image ? (
                      <OptimizedImage src={product.image} alt={product.title} />
                    ) : (
                      <div className={styles.imagePlaceholder}>Image Not Available</div>
                    )}

                    <button
                      className={styles.wishlistButton}
                      onClick={() => handleWishlist(product._id)}
                      aria-label={
                        wishlistItems.some((item) => item._id === product._id) ? "Remove from wishlist" : "Add to wishlist"
                      }
                    >
                      <FaHeart
                        className={`${styles.heartIcon} ${
                          wishlistItems.some((item) => item._id === product._id) ? styles.wishlisted : ""
                        }`}
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
          )}

          {status === "loading" && page > 1 && (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;