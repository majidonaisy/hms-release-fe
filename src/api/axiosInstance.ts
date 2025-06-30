import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { store } from "@/redux/store";
import { logout, updateAccessToken } from "@/redux/slices/authSlice";
import { SERVICE_BASE_URLS } from "./serviceConfig";

// Create a map to store instances for each service
const axiosInstances = new Map<string, any>();

// Helper function to get/create instance for a service
export function getServiceInstance(serviceName: string) {
  if (!axiosInstances.has(serviceName)) {
    const baseURL = SERVICE_BASE_URLS[serviceName] || SERVICE_BASE_URLS.AUTH;

    const instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        "X-Service-Name": serviceName,
      },
    });

    // Request interceptor to add token to headers and handle baseURL
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const { accessToken } = state.auth;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        console.log('accessToken', accessToken)
        
        // Add request metadata for tracking
        config.headers["X-Request-ID"] = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        config.headers["X-Request-Time"] = new Date().toISOString();
        
        // Log the actual URL being used
        const finalURL = (config.baseURL || instance.defaults.baseURL) + "" + config.url;
        console.log(`🔄 Final request URL: ${finalURL}`);

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // The rest of your interceptor code here...

    axiosInstances.set(serviceName, instance);
  }

  return axiosInstances.get(serviceName);
}

// Keep the default export for backward compatibility
export default getServiceInstance('AUTH');