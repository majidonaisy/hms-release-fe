import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddReservationRequest, ReservationResponse } from "@/validation/schemas/Reservations";
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