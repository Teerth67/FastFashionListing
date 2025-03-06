import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosinterceptor/axiosInstance";

// Async thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/wishlist/${userId}`);
      return response.data.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/wishlist/add`, {
        userId,
        productId,
      });
      return { productId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/wishlist/remove`, {
        data: { userId, productId },
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = []; // reset items to empty
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push({ _id: action.payload.productId });
        state.loading = false;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        state.loading = false;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions; 
export default wishlistSlice.reducer;