import axiosInstance from "../lib/axios";
import type { AxiosRequestConfig } from "axios";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  response: {
    data: {
      details: string;
      error: string;
      message: string;
      statusCode: number;
      success: boolean;
      timestamp: string;
    };
  };
}

// Generic HTTP methods
export const apiClient = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get: <T>(url: string, params?: any) =>
    axiosInstance.get<ApiResponse<T>>(url, { params }),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.post<ApiResponse<T>>(url, data, config),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(url: string, data?: any) =>
    axiosInstance.put<ApiResponse<T>>(url, data),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.patch<ApiResponse<T>>(url, data, config),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosInstance.delete<ApiResponse<T>>(url, { data, ...(config || {}) }),
};

export default apiClient;
