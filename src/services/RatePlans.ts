import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { GetRatePlansResponse } from "@/validation/schemas/RatePlan";
const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

interface GetRatePlansParams {
  page?: number;
  limit?: number;
}

export const getRatePlans = async (params?: GetRatePlansParams): Promise<GetRatePlansResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.RatePlan.GetAll,
      baseURL,
      params,
    });
    return response as GetRatePlansResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get rate plans";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
