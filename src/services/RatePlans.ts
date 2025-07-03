import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { GetRatePlansResponse } from "@/validation/schemas/RatePlan";
const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export const getRatePlans = async (): Promise<GetRatePlansResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.RatePlan.GetAll,
      baseURL
    });
    return response as GetRatePlansResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to get rate plans";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};