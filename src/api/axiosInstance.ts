import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

export const createAxiosInstance = (baseURL: string) => {
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
      console.log("Bearer token ", accessToken);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Handle unauthorized access
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
