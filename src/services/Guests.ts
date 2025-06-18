import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import {
  AddGuestRequest,
  AddGuestResponse,
  GetGuestsResponse,
  UpdateGuestRequest,
  UpdateGuestResponse,
} from "@/validation/schemas/Guests";

export const addGuest = async (
  data: AddGuestRequest
): Promise<AddGuestResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Guest.Add,
      data,
    });
    return response as AddGuestResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getGuests = async (): Promise<GetGuestsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Guest.GetAll,
    });
    return response as GetGuestsResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to get guests";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getGuestById = async (id: string): Promise<AddGuestResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Guest.GetById}/${id}`,
    });
    return response as AddGuestResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateGuest = async (
  id: string,
  data: UpdateGuestRequest
): Promise<UpdateGuestResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Guest.Update}/${id}`,
      data,
    });
    return response as UpdateGuestResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to update guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteGuest = async (id: string): Promise<void> => {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Guest.Delete}/${id}`,
    });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
