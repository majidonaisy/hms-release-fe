import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { GetRatePlansResponse, RatePlan, AddRatePlanRequest } from "@/validation/schemas/RatePlan";
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

export const addRatePlan = async (data: AddRatePlanRequest): Promise<RatePlan> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.RatePlan.Add,
      data,
      baseURL,
    });
    return response as RatePlan;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add rate plan";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteRatePlan = async (id: string): Promise<void> => {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.RatePlan.Delete}/${id}`,
      baseURL,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete rate plan";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateRatePlan = async (
  id: string,
  data: {
    name: string;
    code: string;
    basePrice: number;
    baseAdjType: "PERCENT" | "FIXED";
    baseAdjVal: string;
    currencyId: string;
    description?: string;
    isActive?: boolean;
    roomTypeId?: string;
    isFeatured?: boolean;
  }
): Promise<RatePlan> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.RatePlan.Update}/${id}`,
      data,
      baseURL,
    });
    return response as RatePlan;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update rate plan";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
