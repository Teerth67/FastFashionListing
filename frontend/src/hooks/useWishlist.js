import { useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../redux/features/wishlist/wishlistSlice";

const useWishlist = (userData) => {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading } = useSelector((state) => state.wishlist);

  // Extract the actual user data
  const user = userData?.user || userData;

  // Fetch wishlist when user changes
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist(user._id));
    }
  }, [user, dispatch]);

  const handleWishlist = async (productId) => {
    if (!user?._id) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    const isInWishlist = wishlistItems.some((item) => item._id === productId);

    if (isInWishlist) {
      dispatch(removeFromWishlist({ userId: user._id, productId }));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist({ userId: user._id, productId }));
      toast.success("Added to wishlist");
    }
  };

  return { wishlistItems, handleWishlist, loading };
};

export default useWishlist;
