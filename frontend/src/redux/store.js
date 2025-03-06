import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import productReducer from "./features/products/productSlice";
import authReducer from "./features/auth/authSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";

// Persist Config for Auth
const authPersistConfig = {
  key: "auth",
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["isLoggedIn", "user","token"],
};

// Persist Config for Products with autoMerge
const productPersistConfig = {
  key: "products",
  storage,
  stateReconciler: autoMergeLevel2, // Added autoMergeLevel2
  whitelist: [ "products"], // Include products data if needed
};

// Persist Config for Wishlist with autoMerge
const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  stateReconciler: autoMergeLevel2, // Added autoMergeLevel2
  whitelist: ["items"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedProductReducer = persistReducer(productPersistConfig, productReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    products: persistedProductReducer,
    wishlist: persistedWishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for Redux Persist
    }),
});

export const persistor = persistStore(store);