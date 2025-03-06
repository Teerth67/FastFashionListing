import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsApi } from "./productApi";

export const fetchProductsByCollection = createAsyncThunk(
  "products/fetchProductsByCollection",
  async (params, { rejectWithValue }) => {
    try {
      return await fetchProductsApi(params);
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Request failed",
        status: error.response?.status || 400,
      });
    }
  }
);
