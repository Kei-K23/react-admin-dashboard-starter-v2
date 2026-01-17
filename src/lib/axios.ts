import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ACCESS_TOKEN_KEY } from "../common/constraints";

// Default config for the axios instance
const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
};

// Create axios instance
const api: AxiosInstance = axios.create(axiosConfig);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside of 2xx
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error("Unauthorized access");
          break;
        case 403:
          // Handle forbidden
          console.error("Access forbidden");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error("An error occurred");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
