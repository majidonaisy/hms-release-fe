import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddChargeRequest, AddChargeResponse, GetChargesResponse, AddPaymentRequest } from "@/validation/schemas/charges";
import { VoidPaymentsRequest, VoidPaymentsResponse } from "@/validation/schemas/payments";

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

export const addPayment = async (data: AddPaymentRequest): Promise<AddChargeResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Folio.AddPayment,
      data,
      baseURL,
    });
    return response as AddChargeResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add payment";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

// Add interface for the API response structure
interface FolioItem {
  id: string;
  folioId: string;
  itemType: string;
  amount: string;
  quantity: number;
  unitPrice: string;
  status: string;
  voidReason: string | null;
  voidedAt: string | null;
  voidedBy: string | null;
}

interface APIPaymentResponse {
  status: number;
  message: string;
  data: FolioItem[];
}

export const getPayments = async (reservationId: string): Promise<APIPaymentResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Folio.ViewPayment + "/" + reservationId,
      baseURL,
    });
    return response as APIPaymentResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get payments";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const voidPayments = async (data: VoidPaymentsRequest): Promise<VoidPaymentsResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Folio.VoidPayments,
      data,
      baseURL,
    });
    return response as VoidPaymentsResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to void payments";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
