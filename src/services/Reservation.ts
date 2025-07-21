import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddGroupReservationRequest, AddReservationRequest, GetNightPriceResponse, GetReservationByGuestId, ReservationResponse, UpdateReservationRequest } from "@/validation/schemas/Reservations";
import { GetSingleReservationResponse } from "@/validation/schemas/SingleReservation";
const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export const addReservation = async (data: AddReservationRequest): Promise<ReservationResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Reservations.Add,
      baseURL,
      data,
    });
    return response as ReservationResponse;
  } catch (error: any) {
    const data = error.response?.data;
    const errorMessage = data?.error || data?.message || (typeof data === "string" ? data : null) || "Failed to add reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const addGroupReservation = async (data: AddGroupReservationRequest): Promise<ReservationResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Reservations.AddGroupReservation,
      baseURL,
      data,
    });
    return response as ReservationResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

interface GetReservationsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const getReservations = async (startDate?: Date, endDate?: Date, paginationParams?: { page?: number; limit?: number }): Promise<ReservationResponse> => {
  try {
    const params: GetReservationsParams = {};

    // Add date filters if provided
    if (startDate) params.startDate = startDate.toISOString().split("T")[0];
    if (endDate) params.endDate = endDate.toISOString().split("T")[0];

    // Add pagination params if provided
    if (paginationParams?.page) params.page = paginationParams.page;
    if (paginationParams?.limit) params.limit = paginationParams.limit;

    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Reservations.Get,
      baseURL,
      params,
    });
    return response as ReservationResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const checkIn = async (reservationId: string, deposit: number): Promise<any> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Reservations.CheckIn}/${reservationId}`,
      baseURL,
      data: { deposit },
    });
    return response;
  } catch (error: any) {
    const data = error.response?.data;
    const errorMessage = data?.error || data?.message || (typeof data === "string" ? data : null) || "Failed to check out";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const checkOut = async (reservationId: string): Promise<any> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Reservations.CheckOut}/${reservationId}`,
      baseURL,
    });
    return response;
  } catch (error: any) {
    const data = error.response?.data;
    const errorMessage = data?.error || data?.message || (typeof data === "string" ? data : null) || "Failed to check out";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getNightPrice = async (ratePlanId: string, roomTypeId: string): Promise<GetNightPriceResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Reservations.GetNightPrice,
      baseURL,
      params: {
        ratePlanId: ratePlanId,
        roomTypeId: roomTypeId,
      },
    });
    return response as GetNightPriceResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to check out";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateReservation = async (id: string, data: UpdateReservationRequest): Promise<ReservationResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Reservations.Update}/${id}`,
      baseURL,
      data,
    });
    return response as ReservationResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getReservationById = async (reservationId: string): Promise<GetSingleReservationResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Reservations.GetId}/${reservationId}`,
      baseURL,
    });
    return response as GetSingleReservationResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const cancelReservation = async (reservationId: string): Promise<any> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Reservations.Cancel}/${reservationId}`,
      baseURL,
    });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to cancel reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const getReservationByGuestId = async (guestId: string): Promise<GetReservationByGuestId> => {
  console.log('called')
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Reservations.GetByGuestId,
      baseURL,
      params: { guestId }
    });
    return response as GetReservationByGuestId;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}