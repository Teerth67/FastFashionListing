import { createSlice } from "@reduxjs/toolkit";
import { fetchProductsByCollection } from "./productThunk";

const initialState = {
  items: [],
  filteredItems: [],
  status: "idle",
  error: null,
  page: 1,
  hasMore: true,
  lastFetchedParams: null,
  sort: "priceLowHigh", // ✅ Add sorting state
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.items = [];
      state.filteredItems = [];
      state.page = 1;
      state.hasMore = true;
      state.lastFetchedParams = null;
      state.error = null;
      state.status = "idle";
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.page += 1; 
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
    
        if (action.payload.page === 1) {
          state.items = action.payload.products;
          state.filteredItems = action.payload.products;
        } else {
          // ✅ Use a Set to store unique product IDs
          const existingIds = new Set(state.items.map(p => p._id));
          
          // ✅ Filter out duplicates before adding new products
          const newProducts = action.payload.products.filter(p => !existingIds.has(p._id));
          
          state.items = [...state.items, ...newProducts];
          state.filteredItems = [...state.filteredItems, ...newProducts];
        }
    
        state.hasMore = action.payload.hasMore;
    })
    
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetProducts, setSort } = productSlice.actions;
export default productSlice.reducer;
