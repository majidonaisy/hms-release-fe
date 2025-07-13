import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddGroupReservationRequest, AddReservationRequest, ReservationResponse } from "@/validation/schemas/Reservations";
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
    const errorMessage = error.response?.data?.message || "Failed to add reservation";
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
      method: 'POST',
      endpoint: `${ENDPOINTS.Reservations.CheckIn}/${reservationId}`,
      baseURL,
      data: { deposit }
    });
    return response
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to check in";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const checkOut = async (reservationId: string): Promise<any> => {
  try {
    const response = await apiClient({
      method: 'POST',
      endpoint: `${ENDPOINTS.Reservations.CheckOut}/${reservationId}`,
      baseURL
    });
    return response
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to check out";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}