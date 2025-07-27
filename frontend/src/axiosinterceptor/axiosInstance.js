const axios = require('axios');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    const { config, response } = error;
    if (response?.status === 401) {
      const message = response.data.message || '';
      if (
        message.includes('User not found') ||
        message.includes('Invalid credentials')
      ) {
        // Handle unauthorized errors
      }
    }
    return Promise.reject(error);
  }
);

module.exports = axiosInstance;
