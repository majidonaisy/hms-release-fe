import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { GetCurrentGroupProfilesResponse, GetCurrentGuestsResponse } from "@/validation/schemas/Guests";
import { AddGroupReservationRequest, AddReservationRequest, CheckInReservations, GetNightPriceResponse, GetReservationByGroupId, GetReservationByGuestId, GetReservationById, ReservationResponse, UpdateReservationRequest } from "@/validation/schemas/Reservations";
import { getFrontdeskServiceUrl } from "./configServices";

const baseURL = await getFrontdeskServiceUrl();

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
    const data = error.response?.data;
    const errorMessage = data?.error || data?.message || (typeof data === "string" ? data : null) || "Failed to add reservation";
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

export const checkIn = async (reservationId: string, deposit: number, identification: JSON): Promise<any> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Reservations.CheckIn}/${reservationId}`,
      baseURL,
      data: { deposit, identification },
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

export const getReservationById = async (reservationId: string): Promise<GetReservationById> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Reservations.GetId}/${reservationId}`,
      baseURL,
    });
    return response as GetReservationById;
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
};

export const getReservationByGuestId = async (guestId: string): Promise<GetReservationByGuestId> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Reservations.GetByGuestId,
      baseURL,
      params: { guestId },
    });
    return response as GetReservationByGuestId;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getReservationByGroupId = async (groupId: string): Promise<GetReservationByGroupId> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Reservations.GetByGroupId}/${groupId}`,
      baseURL,
    });
    return response as GetReservationByGroupId;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getCurrentGuests = async (params: { q: string }): Promise<GetCurrentGuestsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Guest.GetCurrentGuests,
      baseURL,
      params,
    });
    return response as GetCurrentGuestsResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get guests";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getCurrentGroupProfiles = async (params: { q: string }): Promise<GetCurrentGroupProfilesResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.GroupProfile.GetCurrentGroupProfiles,
      baseURL,
      params,
    });
    return response as GetCurrentGroupProfilesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get group profiles";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const getCheckedInReservations = async (): Promise<CheckInReservations> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Reservations.CheckedInReservations,
      baseURL,
    });
    return response as CheckInReservations;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get reservations";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}