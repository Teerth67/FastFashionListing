import axiosInstance from "../../../axiosinterceptor/axiosInstance"; // ✅ Use axiosInstance
import { toast } from "react-toastify";
const API_URL = "/users/"; // ✅ Base API route


// REGISTER USER
const register = async (userData) => {
  const response = await axiosInstance.post(`${API_URL}register`, userData);
  // Save token from registration response
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// In authService.js
// LOGIN USER
const login = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}login`, userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
   // console.log("Login Response:", response.data);
    return response.data;
  } catch (error) {
    //console.error("Login failed:", error);

    if (error.response) {
      // Check for specific error messages
      const errorMessage = error.response.data.message || "";
      
      if (errorMessage.includes("User not found") || errorMessage.includes("Invalid credentials")) {
        //toast.error("User does not exist! Please register.");
      } else {
        //toast.error(errorMessage || "Login failed");
      }
    } else {
      toast.error("Login failed! Please try again.");
    }

    throw error;
  }
};

// LOGOUT USER (Ensure Local Storage is Cleared)
const logout = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}logout`);
    
    if (response.status === 200) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem('persist:wishlist');
      localStorage.removeItem("persist:auth");
    }

    return response.data.message;
  } catch (error) {
    //console.error("Logout failed:", error);
    
    // Clear local storage anyway even if the API call fails
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem('persist:wishlist');
    localStorage.removeItem("persist:auth");
  }
};

// GET LOGIN STATUS (Handle Expired Token)
const getLoginStatus = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}getLoginStatus`);
    return response.data;
  } catch (error) {
    console.error("Login status check failed:", error);
    
    // Handle token expiry correctly
    if (error.response && error.response.status === 401) {
      //toast.error("Session expired! Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("persist:auth");
      localStorage.removeItem('persist:wishlist');
    }

    return { isLoggedIn: false };
  }
};
// GET USER
const getUser = async () => {
  const response = await axiosInstance.get(`${API_URL}getUser`);
  return response.data;
};

// UPDATE USER
const updateUser = async (userData) => {
  const response = await axiosInstance.patch(`${API_URL}updateUser`, userData);
  return response.data;
};

// UPDATE PHOTO
const updatePhoto = async (userData) => {
  const response = await axiosInstance.patch(`${API_URL}updatePhoto`, userData);
  return response.data;
};

// EXPORT AUTH SERVICE
const authService = {
  register,
  login,
  logout,
  getLoginStatus,
  getUser,
  updateUser,
  updatePhoto,
};
export default authService;
