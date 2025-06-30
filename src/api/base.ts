import { AxiosError } from "axios";
import { getServiceInstance } from "./axiosInstance";
import { getServiceForEndpoint } from "./serviceConfig";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  params?: unknown;
  baseURL?: string; 
}

export const apiClient = async ({ method, endpoint, data, params, baseURL }: ApiOptions): Promise<unknown> => {
  try {
    const serviceName = getServiceForEndpoint(endpoint);
    const serviceInstance = getServiceInstance(serviceName);
    const requestConfig = {
      method,
      url: endpoint,
      data,
      params,
      ...(baseURL && { baseURL }),
    };
    const response = await serviceInstance(requestConfig);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    throw error;
  }
};
