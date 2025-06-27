import { AxiosError } from "axios";
import { getServiceInstance } from "./axiosInstance";
import { getServiceForEndpoint } from "./serviceConfig";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  params?: unknown;
  service?: string; // Optional service override
  baseURL?: string; // Add this line - optional base URL override
}

export const apiClient = async ({ 
  method, 
  endpoint, 
  data, 
  params, 
  service,
  baseURL 
}: ApiOptions): Promise<unknown> => {
  try {
    // Determine service based on endpoint pattern or explicit service parameter
    const serviceName = service || getServiceForEndpoint(endpoint);

    // Get the appropriate axios instance for this service
    const serviceInstance = getServiceInstance(serviceName);
    
    // Create the config object for the request
    const requestConfig = {
      method,
      url: endpoint,
      data,
      params,
      baseURL, // This will override the default baseURL if provided
    };
    
    // Log which service and baseURL are being used (helpful for debugging)
    console.log(`🔄 Using ${serviceName} service for endpoint: ${endpoint}${baseURL ? ` with custom baseURL: ${baseURL}` : ''}`);

    // Make the request with the config
    const response = await serviceInstance(requestConfig);

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    throw error;
  }
};