import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts } from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/loader/Loader";
import styles from "../collections/Collections.module.scss";

const SaleGenderPage = () => {
  const dispatch = useDispatch();
  const { gender } = useParams(); // Extract gender from URL
  const { filteredItems: products, status, error, page, hasMore } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user);

  useEffect(() => {
    dispatch(resetProducts());
    
   
    dispatch(fetchProductsByCollection({ sale: true, gender, page: 1 })); // Pass gender filter
  }, [dispatch, gender]);

  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    dispatch(fetchProductsByCollection({ sale: true, gender, page }));
  }, [status, dispatch, page, hasMore, gender]);

  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (status === "loading" || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage]
  );

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return typeof price === "number"
      ? `Rs ${price.toLocaleString()}`
      : price.toString().replace("Rs.", "Rs ").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  if (status === "loading" && page === 1) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error.message || "An error occurred"}</div>;
  }

  return (
    <div className={styles.collectionsPage}>
      <h1 className={styles.pageTitle}>{gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Sale` : "Sale"}</h1>

      <div className={styles.productsGrid}>
        {Array.isArray(products) &&
          products.map((product, index) => (
            <article
              className={styles.productCard}
              key={product._id}
              ref={index === products.length - 1 ? lastProductRef : null}
            >
              <div className={styles.productImage}>
                <img src={product.image} alt={product.title || "Product"} loading="lazy" />
                <button className={styles.wishlistButton} onClick={() => handleWishlist(product._id)}>
                  <FaHeart className={`${styles.heartIcon} ${wishlistItems.some((item) => item._id === product._id) ? styles.wishlisted : ""}`} />
                </button>
              </div>
              <div className={styles.productInfo}>
                <h2 className={styles.productTitle}>{product.title || "Untitled Product"}</h2>
                <p className={styles.productSource}>{product.source || "Unknown Source"}</p>
                <p className={styles.productPrice}>
                  {product.salePrice && product.salePrice !== "N/A" ? (
                    <>
                      <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                      <span className={styles.salePrice}>{formatPrice(product.salePrice)}</span>
                    </>
                  ) : (
                    formatPrice(product.price)
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

export default SaleGenderPage;
