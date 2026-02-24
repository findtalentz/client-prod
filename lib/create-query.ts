import ApiResponse from "@/schemas/ApiRespose";
import apiClient from "@/services/api-client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { CACHE } from "./constants";

export function createQuery<T>(config: {
  queryKey: string[];
  url: string;
  params?: Record<string, unknown>;
  staleTime?: number;
  retry?: number;
}): () => UseQueryResult<ApiResponse<T>, Error>;

export function createQuery<T, P>(config: {
  queryKey: (params: P) => (string | number | undefined)[];
  url: string | ((params: P) => string);
  params?: (params: P) => Record<string, unknown>;
  method?: "post";
  body?: (params: P) => Record<string, unknown>;
  staleTime?: number;
  retry?: number;
}): (params: P) => UseQueryResult<ApiResponse<T>, Error>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createQuery<T>(config: {
  queryKey: string[] | ((params: any) => (string | number | undefined)[]);
  url: string | ((params: any) => string);
  params?: Record<string, unknown> | ((params: any) => Record<string, unknown>);
  method?: "post";
  body?: (params: any) => Record<string, unknown>;
  staleTime?: number;
  retry?: number;
}) {
  const { staleTime = CACHE.STANDARD, retry = 1, method } = config;

  return (params?: any) => {
    const queryKey =
      typeof config.queryKey === "function"
        ? config.queryKey(params)
        : config.queryKey;

    const url =
      typeof config.url === "function" ? config.url(params) : config.url;

    const queryParams =
      typeof config.params === "function"
        ? config.params(params)
        : config.params;

    const body = config.body?.(params);

    return useQuery<ApiResponse<T>, Error>({
      queryKey,
      queryFn: () =>
        method === "post"
          ? apiClient.post<ApiResponse<T>>(url, body).then((r) => r.data)
          : apiClient
              .get<ApiResponse<T>>(
                url,
                queryParams ? { params: queryParams } : undefined
              )
              .then((r) => r.data),
      staleTime,
      retry,
    });
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
