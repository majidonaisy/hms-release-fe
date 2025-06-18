import { AxiosError } from "axios";
import axiosInstance from "./axiosInstance";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method: HttpMethod;
  endpoint: string;
  data?: unknown;
  params?: unknown;

}

export const apiClient = async ({ method, endpoint, data, params }: ApiOptions): Promise<unknown> => {
  try {
    const response = await axiosInstance({
      method,
      url: endpoint, 
      data,
      params,
    });

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    throw error;
  }
};
