import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";
import { refreshToken as rf} from "@/services/Auth";

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
      const { accessToken, permissions } = state.auth;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Add request metadata for tracking
      config.headers["X-Request-ID"] = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      config.headers["X-Request-Time"] = new Date().toISOString();

      // Log full request details
      console.log("Full Request Details:", {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        params: config.params,
        data: config.data,
        token: accessToken ? `Bearer ${accessToken.substring(0, 10)}...` : "No token",
        permissions: permissions,
      });

      return config;
    },
    (error) => {
      console.error("Request Error Interceptor:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Log successful response details
      console.log("Response Success:", {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        data: response.data,
        headers: response.headers,
        requestData: response.config.data,
        requestParams: response.config.params,
      });
      return response;
    },
    (error) => {
      const state = store.getState();
    const { refreshToken } = state.auth;

      if (error.response?.status === 401) {
        if(!refreshToken) return ;
         rf(refreshToken); 
      }
      // Log error response details
      console.error("Response Error:", {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        // Include request details for context
        requestData: error.config?.data,
        requestParams: error.config?.params,
        message: error.message,
      });

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
