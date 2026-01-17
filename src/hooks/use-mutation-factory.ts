import {
  type QueryKey,
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiError, ApiResponse } from "../lib/api";

// Generic mutation hook factory
export const createMutationHook = <TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: Omit<
    UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
    "mutationFn"
  > & {
    invalidateQueries?: QueryKey[];
  }
) => {
  return (): UseMutationResult<TData, TError, TVariables> => {
    const queryClient = useQueryClient();

    const result = useMutation<ApiResponse<TData>, TError, TVariables>({
      mutationFn,
      ...options,
      onSuccess: (data, variables, mutationResult, context) => {
        // Invalidate related queries
        if (options?.invalidateQueries) {
          options.invalidateQueries.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
          });
        }

        // Call original onSuccess if provided
        options?.onSuccess?.(data, variables, mutationResult, context);
      },
    });

    return {
      ...result,
      data: result.data?.data,
    } as UseMutationResult<TData, TError, TVariables>;
  };
};
