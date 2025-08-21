import axios, { AxiosInstance } from "axios";
import { store } from "@/redux/store";
import { logout, setTokens } from "@/redux/slices/authSlice";
import { refreshToken as rf } from "@/services/Auth";
import { toast } from "sonner";

const instancesCache = new Map<string, AxiosInstance>();

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  if (instancesCache.has(baseURL)) {
    return instancesCache.get(baseURL)!;
  }

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const { accessToken } = state.auth;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Add request metadata for tracking
      config.headers["X-Request-ID"] = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      config.headers["X-Request-Time"] = new Date().toISOString();

      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const state = store.getState();
      const { refreshToken } = state.auth;

      if (error.response?.status === 403) {
        const errorData = error.response?.data;
        if (errorData?.error === "INSUFFICIENT_PERMISSIONS" && errorData?.required) {
          const missingPermissions = errorData.required.join(", ");
          const message = `You don't have the permissions to perform this action, missing: ${missingPermissions}`;
          toast.error(message);
        }
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (!refreshToken) {
          console.log("No refresh token available, logging out");
          store.dispatch(logout());
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await rf(refreshToken);
          store.dispatch(
            setTokens({
              accessToken: refreshResponse.data.accessToken,
              refreshToken: refreshResponse.data.refreshToken || refreshToken,
            })
          );

          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          processQueue(null, refreshResponse.data.accessToken);
          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          processQueue(refreshError, null);
          store.dispatch(logout());
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  instancesCache.set(baseURL, instance);
  return instance;
};

export const clearAxiosInstanceCache = () => {
  instancesCache.clear();
};