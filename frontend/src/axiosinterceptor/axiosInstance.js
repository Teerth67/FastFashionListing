import axios from "axios";
import { toast } from "react-toastify";
const BACKEND_URL = "http://localhost:5000/proxy";


const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Add a flag to identify errors already handled by the interceptor
    if (error.response?.status === 401) {
      const errorMessage = error.response.data.message || "";
      
      // Add a flag to the error to show it's been handled by the interceptor
      error.handledByInterceptor = true;

      // Handle "User not found!" or similar credential errors
      if (errorMessage.includes("User not found") || errorMessage.includes("Invalid credentials") || errorMessage.includes("does not exist")) {
        // Don't show any toast notification here - let the service handle it
        return Promise.reject(error);
      }

      // Handle expired token case
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Only for actual expired session cases
        if (errorMessage.includes("expired") || errorMessage.includes("invalid token")) {
          //toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("persist:auth");
          localStorage.removeItem('persist:wishlist');
          
          // Only redirect if we're not already on the home page
          if (window.location.pathname !== '/') {
            window.location.href = "/";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
export default axiosInstance;
