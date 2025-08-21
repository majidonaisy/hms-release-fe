import { AxiosError } from "axios";
import { createAxiosInstance } from "./axiosInstance";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  params?: unknown;
  baseURL: string;
  skipCache?: boolean;
}

const requestCache = new Map<string, Promise<unknown>>();
const CACHE_TTL = 100;

const getCacheKey = (options: ApiOptions): string => {
  const { method, endpoint, baseURL, params } = options;
  return `${method}:${baseURL}${endpoint}:${JSON.stringify(params)}`;
};

export const apiClient = async (options: ApiOptions): Promise<unknown> => {
  const { method, endpoint, data, params, baseURL, skipCache = false } = options;

  try {
    const shouldCache = method === 'GET' && !skipCache;
    const cacheKey = getCacheKey(options);

    if (shouldCache && requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey)!;
    }

    const instance = createAxiosInstance(baseURL);
    const requestPromise = instance({
      method,
      url: endpoint,
      data,
      params
    }).then(response => response.data);

    if (shouldCache) {
      requestCache.set(cacheKey, requestPromise);

      setTimeout(() => {
        requestCache.delete(cacheKey);
      }, CACHE_TTL);
    }

    return await requestPromise;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
};