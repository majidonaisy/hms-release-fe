import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import {
  AddRoomRequest,
  AddRoomResponse,
  GetRoomsResponse,
  UpdateRoomRequest,
  UpdateRoomResponse,
} from "@/validation/schemas/Rooms";

export const addRoom = async (
  data: AddRoomRequest
): Promise<AddRoomResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Room.Add,
      data,
    });
    return response as AddRoomResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add room";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getRooms = async (): Promise<GetRoomsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Room.GetAll,
    });
    return response as GetRoomsResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get rooms";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getRoomById = async (id: string): Promise<AddRoomResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Room.GetById}/${id}`,
    });
    return response as AddRoomResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get room";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateRoom = async (
  id: string,
  data: UpdateRoomRequest
): Promise<UpdateRoomResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Room.Update}/${id}`,
      data,
    });
    return response as UpdateRoomResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to update room";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteRoom = async (id: string): Promise<void> => {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Room.Delete}/${id}`,
    });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete room";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getRoomsByStatus = async (
  status: string
): Promise<GetRoomsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Room.GetByStatus}/${status}`,
    });
    return response as GetRoomsResponse;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to get rooms by status";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
