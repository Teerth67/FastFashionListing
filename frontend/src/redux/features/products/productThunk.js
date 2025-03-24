import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductsApi, fetchFilterOptionsApi } from "./productApi";

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

export const fetchFilterOptions = createAsyncThunk(
  "products/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchFilterOptionsApi();
      if (!response.success) {
        return rejectWithValue(response.error || "Failed to fetch filter options");
      }
      return response.filterOptions;
    } catch (error) {
      return rejectWithValue(
        error.message || "An error occurred while fetching filter options"
      );
    }
  }
);