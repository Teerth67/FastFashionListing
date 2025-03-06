import React from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaTrash } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist"; // ✅ Import the hook
import styles from "./Wishlist.module.scss";
import Loader from "../../components/loader/Loader";
import OptimizedImage from "../../components/optimizeImage/optimizeImage";

const Wishlist = () => {
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user); // ✅ Destructure correctly

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return typeof price === "number"
      ? `Rs ${price.toLocaleString()}`
      : price.toString().replace("Rs.", "Rs ").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  if (!user) {
    return (
      <div className={styles.wishlistPage}>
        <div className={styles.emptyState}>
          <h2>Please login to view your wishlist</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.wishlistHeader}>
        <FaHeart className={styles.headerIcon} />
        <h1>My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Your wishlist is empty</h2>
          <p>Save items you like by clicking the heart icon on any product</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {wishlistItems.map((product) => (
            <article className={styles.productCard} key={product._id}>
              <div className={styles.productImage}>
                <button 
                  className={styles.removeButton}
                  onClick={() => handleWishlist(product._id)} // ✅ Use handleWishlist properly
                  aria-label="Remove from wishlist"
                >
                  <FaTrash />
                </button>
                {product.image ? (
                  <OptimizedImage src={product.image} alt={product.title} />
                ) : (
                  <div className={styles.imagePlaceholder}>Image Not Available</div>
                )}
              </div>
              <div className={styles.productInfo}>
                <h2 className={styles.productTitle}>{product.title}</h2>
                <p className={styles.productSource}>{product.source}</p>
                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                <div className={styles.productActions}>
                  <a 
                    href={product.link} 
                    className={styles.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Product
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
