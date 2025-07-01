import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddRoomTypeRequest, AddRoomTypeResponse, GetRoomTypesResponse, UpdateRoomTypeRequest, UpdateRoomTypeResponse } from "@/validation";
const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL; // Base URL for room types

export const addRoomType = async (data: AddRoomTypeRequest): Promise<AddRoomTypeResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.RoomType.Add,
      baseURL,
      data,
    });
    return response as AddRoomTypeResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add room type";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getRoomTypes = async (): Promise<GetRoomTypesResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.RoomType.GetAll,
      baseURL,
    });
    return response as GetRoomTypesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get room types";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateRoomType = async (id: string, data: UpdateRoomTypeRequest): Promise<UpdateRoomTypeResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.RoomType.Update}/${id}`,
      data,
      baseURL,
    });
    return response as UpdateRoomTypeResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update room type";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteRoomType = async (id: string): Promise<void> => {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.RoomType.Delete}/${id}`,
      baseURL,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete room type";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
