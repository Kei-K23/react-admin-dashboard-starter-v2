import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type QueryKey,
} from "@tanstack/react-query";
import type { ApiError, ApiResponse } from "../lib/api";

// Generic query hook factory
export const createQueryHook = <TData, TError = ApiError>(
  key: QueryKey,
  fetcher: (
    params?: Record<string, string | number | boolean>
  ) => Promise<ApiResponse<TData>>,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData>, TError, TData>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return (
    params?: Record<string, string | number | boolean>
  ): UseQueryResult<TData, TError> => {
    const result = useQuery<ApiResponse<TData>, TError, TData>({
      queryKey: key,
      queryFn: () => fetcher(params || {}),
      select: (response) => response.data,
      ...options,
    });

    return result;
  };
};

// Paginated query hook factory
export const createPaginatedQueryHook = <TData, TError = ApiError>(
  key: QueryKey,
  fetcher: (
    params: Record<string, string | number | boolean>
  ) => Promise<ApiResponse<TData[]>>,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData[]>, TError, TData[]>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return (
    params?: Record<string, string | number | boolean>
  ): UseQueryResult<TData[], TError> => {
    const queryKey = [...key, params];

    const result = useQuery<ApiResponse<TData[]>, TError, TData[]>({
      queryKey,
      queryFn: () => fetcher(params || {}),
      select: (response) => response.data ?? [],
      ...options,
    });

    return result;
  };
};
