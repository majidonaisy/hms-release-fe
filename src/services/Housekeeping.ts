import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import {
  AddHousekeepingRequest,
  AddHousekeepingResponse,
  GetHousekeepingResponse,
  GetHousekeepingByIdResponse,
  UpdateHousekeepingRequest,
  UpdateHousekeepingResponse,
  StartHousekeepingResponse,
  CompleteHousekeepingResponse,
  DeleteHousekeepingResponse,
} from "@/validation/schemas/housekeeping";

const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export const addHousekeepingTask = async (data: AddHousekeepingRequest): Promise<AddHousekeepingResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Housekeeping.Add,
      data,
      baseURL,
    });
    return response as AddHousekeepingResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to create housekeeping task";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getHousekeepingTasks = async (): Promise<GetHousekeepingResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Housekeeping.GetAll,
      baseURL,
    });
    return response as GetHousekeepingResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get housekeeping tasks";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getHousekeepingTaskById = async (id: string): Promise<GetHousekeepingByIdResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Housekeeping.GetById}/${id}`,
      baseURL,
    });
    return response as GetHousekeepingByIdResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get housekeeping task";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateHousekeepingTask = async (id: string, data: UpdateHousekeepingRequest): Promise<UpdateHousekeepingResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Housekeeping.Update}/${id}`,
      data,
      baseURL,
    });
    return response as UpdateHousekeepingResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update housekeeping task";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const startHousekeepingTask = async (id: string): Promise<StartHousekeepingResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Housekeeping.Start}/${id}`,
      baseURL,
    });
    return response as StartHousekeepingResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to start housekeeping task";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const completeHousekeepingTask = async (id: string): Promise<CompleteHousekeepingResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Housekeeping.Complete}/${id}`,
      baseURL,
    });
    return response as CompleteHousekeepingResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to complete housekeeping task";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteHousekeepingTask = async (id: string): Promise<DeleteHousekeepingResponse> => {
  try {
    const response = await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Housekeeping.Delete}/${id}`,
      baseURL,
    });
    return response as DeleteHousekeepingResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete housekeeping task";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
