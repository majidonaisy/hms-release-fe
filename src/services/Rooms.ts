import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AmenityResponse } from "@/validation/schemas/amenity";
import { AddRoomRequest, AddRoomResponse, GetRoomByIdResponse, GetRoomsByRoomType, GetRoomsResponse, UpdateRoomRequest, UpdateRoomResponse } from "@/validation/schemas/Rooms";

const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export const addRoom = async (data: AddRoomRequest): Promise<AddRoomResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Room.Add,
      data,
      baseURL,
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

interface GetRoomsParams {
  page?: number;
  limit?: number;
}

export const getRooms = async (params?: GetRoomsParams): Promise<GetRoomsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Room.GetAll,
      baseURL,
      params,
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

export const getRoomById = async (id: string): Promise<GetRoomByIdResponse> => {
  try {
    const response = (await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Room.GetById}/${id}`,
      baseURL,
    })) as any;
    return response as GetRoomByIdResponse
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get room";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateRoom = async (id: string, data: UpdateRoomRequest): Promise<UpdateRoomResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Room.Update}/${id}`,
      data,
      baseURL,
    });
    return response as UpdateRoomResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update room";
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
      baseURL,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete room";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getRoomsByStatus = async (status: string, params?: GetRoomsParams): Promise<GetRoomsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Room.GetByStatus}/${status}`,
      baseURL,
      params,
    });
    return response as GetRoomsResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get rooms by status";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getAmenities = async (): Promise<AmenityResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Amenities.GetAllAmenities,
      baseURL,
    });
    return response as AmenityResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get amenities";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getRoomsByRoomTypes = async (id: string, params?: GetRoomsParams): Promise<GetRoomsByRoomType> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Room.GetByType}/${id}`,
      baseURL,
      params,
    });
    return response as GetRoomsByRoomType;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get rooms by type";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
