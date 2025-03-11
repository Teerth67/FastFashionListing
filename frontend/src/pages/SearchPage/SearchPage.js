import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSort } from '../../redux/features/products/productSlice';
import axiosInstance from '../../axiosinterceptor/axiosInstance';
import styles from './SearchPage.module.scss';
import useWishlist from '../../hooks/useWishlist';
import OptimizedImage from '../../components/optimizeImage/optimizeImage';

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { sort } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Track if initial load has occurred and keep a ref for previous sort
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const prevQueryRef = useRef(query);
  const prevSortRef = useRef(sort);


  useEffect(() => {
    window.scrollTo(0, 0);
  
    const isQueryChanged = prevQueryRef.current !== query;
    const isSortChanged = prevSortRef.current !== sort;
  
    if ((query && !initialLoadDone) || isQueryChanged || isSortChanged) {
      setProducts([]);
      setPage(1);
      setHasMore(false);
      setError(null);
  
      const effectiveSort = sort || "newest";
      if (!sort) {
        dispatch(setSort("newest"));
      }
  
      searchProducts(query, 1, effectiveSort);
      prevQueryRef.current = query;
      prevSortRef.current = effectiveSort;
      setInitialLoadDone(true);
    }
  }, [query, sort, dispatch, initialLoadDone]);
  


  // TRACK SORT CHANGES: Reset and re-fetch when sort changes after the initial load.
  useEffect(() => {
    if (initialLoadDone && query && prevSortRef.current !== sort) {
      prevSortRef.current = sort;
      setPage(1);
      setProducts([]);
      searchProducts(query, 1, sort);
    }
  }, [dispatch, query, sort, initialLoadDone]);

  const searchProducts = async (searchQuery, pageNum = 1, sortOrder) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(
        `/products/search?q=${encodeURIComponent(searchQuery)}&page=${pageNum}&limit=12&sort=${sortOrder}`
      );

      setProducts((prev) =>
        pageNum === 1 ? response.data.data : [...prev, ...response.data.data]
      );
      setHasMore(response.data.hasMore);
      setPage(pageNum + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Dispatch Redux action on sort change.
  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
  };

  // Infinite scrolling logic.
  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          searchProducts(query, page, sort);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, query, page, sort]
  );

  return (
    <div className={styles.collectionsPage}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Search Results for "{query}"</h1>

        <div className={styles.sortContainer}>
          <span className={styles.sortLabel}>Sort By:</span>
          <select className={styles.sortDropdown} value={sort} onChange={handleSortChange}>
            <option value="newest">Latest</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
          </select>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <div 
            key={product._id}
            className={styles.productCard}
            ref={index === products.length - 1 ? lastProductRef : null}
          >
            <div className={styles.productImage}>
              {product.image ? (
                <OptimizedImage src={product.image} alt={product.title} />
              ) : (
                <div className={styles.imagePlaceholder}>Image not available</div>
              )}

              <button
                className={styles.wishlistButton}
                onClick={() => handleWishlist(product._id)}
                aria-label={
                  wishlistItems.some((item) => item._id === product._id)
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
              >
                <Heart
                  className={
                    wishlistItems.some((item) => item._id === product._id)
                      ? styles.wishlisted
                      : ''
                  }
                />
              </button>
            </div>

            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.productSource}>{product.source}</p>
              <p className={styles.productPrice}>
                {product.salePrice && product.salePrice !== 'N/A' ? (
                  <>
                    <span className={styles.originalPrice}>{product.price}</span>
                    <span className={styles.salePrice}>{product.salePrice}</span>
                  </>
                ) : (
                  product.price
                )}
              </p>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.productLink}
              >
                View Product
              </a>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      {!loading && products.length === 0 && query && (
        <div className={styles.error}>No products found for "{query}"</div>
      )}
    </div>
  );
};

export default SearchResultsPage;
