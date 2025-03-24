import { createSlice } from "@reduxjs/toolkit";
import { fetchProductsByCollection, fetchFilterOptions } from "./productThunk";

const initialState = {
  items: [],
  filteredItems: [],
  status: "idle",
  error: null,
  page: 1,
  hasMore: true,
  lastFetchedParams: null,
  sort: "newest",
  // Add filter-related state
  filters: {
    brands: null,
    categories: null,
    minPrice: null,
    maxPrice: null,
    styles: null
  },
  filterOptions: {
    brands: [],
    categories: [],
    styles: [],
    priceRange: { min: 0, max: 1000 }
  },
  filterOptionsStatus: "idle",
  filterOptionsError: null
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
      // Don't reset filters or filter options
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    // Add a reducer to set filters
    setFilters: (state, action) => {
      state.filters = {
        brands: action.payload.brands ?? null,
        categories: action.payload.categories ?? null,
        minPrice: action.payload.minPrice ?? null,
        maxPrice: action.payload.maxPrice ?? null,
        styles: action.payload.styles ?? null,
      };
      state.page = 1;
    },
    
    // Add a reducer to reset filters
    resetFilters: (state) => {
      state.filters = {
        brands: null,
        categories: null,
        minPrice: null,
        maxPrice: null,
        styles: null
      };
    }
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
          // Use a Set to store unique product IDs
          const existingIds = new Set(state.items.map(p => p._id));
          
          // Filter out duplicates before adding new products
          const newProducts = action.payload.products.filter(p => !existingIds.has(p._id));
          
          state.items = [...state.items, ...newProducts];
          state.filteredItems = [...state.filteredItems, ...newProducts];
        }
    
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add cases for fetchFilterOptions
      .addCase(fetchFilterOptions.pending, (state) => {
        state.filterOptionsStatus = "loading";
        state.filterOptionsError = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptionsStatus = "succeeded";
        state.filterOptions = action.payload;
        state.filterOptionsError = null;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.filterOptionsStatus = "failed";
        state.filterOptionsError = action.payload;
      });
  },
});

export const { resetProducts, setSort, setFilters, resetFilters } = productSlice.actions;
export default productSlice.reducer;