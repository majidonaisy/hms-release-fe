import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddChargeRequest, AddChargeResponse, GetChargesResponse } from "@/validation/schemas/charges";

const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export const getUnsetledCharges = async (reservationId: string) => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Folio.UnsettledCharges + "/" + reservationId,
      baseURL,
    });
    return response as GetChargesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get unsettled charges";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const addCharges = async (data: AddChargeRequest): Promise<AddChargeResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Folio.AddCharge,
      data,
      baseURL,
    });
    return response as AddChargeResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add charges";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
