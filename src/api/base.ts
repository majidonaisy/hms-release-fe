import { AxiosError } from "axios";
import { createAxiosInstance } from "./axiosInstance";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  params?: unknown;
  baseURL: string; // Make baseURL required
}

export const apiClient = async ({ method, endpoint, data, params, baseURL }: ApiOptions): Promise<unknown> => {
  try {
    const instance = createAxiosInstance(baseURL);
    const response = await instance({
      method,
      url: endpoint,
      data,
      params
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError;
  }
};