import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddChargeRequest, AddChargeResponse, GetChargesResponse, AddPaymentRequest, TransferChargesRequest, TransferItemsResponse } from "@/validation/schemas/charges";
import { VoidPaymentsRequest, VoidPaymentsResponse } from "@/validation/schemas/payments";
import { getFrontdeskServiceUrl } from "./configServices";

const baseURL = await getFrontdeskServiceUrl();

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
    if (error.response?.status === 404) {
      return {
        data: [],
        message: "No payments found",
        status: 404
      } as APIPaymentResponse;
    }

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
      method: "PUT",
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

// Late checkout fee interfaces and functions
export interface SettleLateCheckoutFeeRequest {
  body: {
    fee?: number;
    currencyId?: string;
    paymentMethod?: string;
  };
}

export interface SettleLateCheckoutFeeResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    folioItemId?: string;
  };
}

export interface LateCheckoutFeeInfo {
  fee: number;
  currencyId: string;
}

export interface GetLateCheckoutFeeResponse {
  status: number;
  message: string;
  data: LateCheckoutFeeInfo;
}

export const settleLateCheckoutFee = async (reservationId: string, data: SettleLateCheckoutFeeRequest): Promise<SettleLateCheckoutFeeResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Folio.SettleLateCheckoutFee}/${reservationId}`,
      data,
      baseURL,
    });
    return response as SettleLateCheckoutFeeResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to settle late checkout fee";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getLateCheckoutFee = async (reservationId: string): Promise<GetLateCheckoutFeeResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Folio.GetLateCheckoutFee}/${reservationId}`,
      baseURL,
    });
    return response as GetLateCheckoutFeeResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get late checkout fee";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const transferCharges = async (data: TransferChargesRequest): Promise<any> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Folio.TransferCharge,
      baseURL,
      data
    });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to transfer charge";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const getTransferItems = async (reservationId: string): Promise<TransferItemsResponse['data']> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Folio.GetTransferItems}/${reservationId}`,
      baseURL,
    });

    return (response as TransferItemsResponse).data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get items";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
