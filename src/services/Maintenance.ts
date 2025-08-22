import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import {
  AddMaintenanceRequest,
  AddMaintenanceResponse,
  GetMaintenancesResponse,
  GetMaintenanceByIdResponse,
  UpdateMaintenanceRequest,
  UpdateMaintenanceResponse,
  StartMaintenanceResponse,
  CompleteMaintenanceResponse,
  DeleteMaintenanceResponse,
} from "@/validation/schemas/maintenance";
import { getFrontdeskServiceUrl } from "./configServices";

const baseURL = await getFrontdeskServiceUrl();

export const addMaintenance = async (data: AddMaintenanceRequest): Promise<AddMaintenanceResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Maintenance.Add,
      data,
      baseURL,
    });
    return response as AddMaintenanceResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to create maintenance request";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

interface GetMaintenancesParams {
  page?: number;
  limit?: number;
  status?: string
}

export const getMaintenances = async (params?: GetMaintenancesParams): Promise<GetMaintenancesResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Maintenance.GetAll,
      baseURL,
      params,
    });
    return response as GetMaintenancesResponse;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        data: [],
        message: "No maintenance requests found",
        status: 404
      } as GetMaintenancesResponse;
    }

    const errorMessage = error.response?.data?.message || "Failed to get maintenance requests";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getMaintenanceById = async (id: string): Promise<GetMaintenanceByIdResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Maintenance.GetById}/${id}`,
      baseURL,
    });
    return response as GetMaintenanceByIdResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get maintenance request";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateMaintenance = async (id: string, data: UpdateMaintenanceRequest): Promise<UpdateMaintenanceResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Maintenance.Update}/${id}`,
      data,
      baseURL,
    });
    return response as UpdateMaintenanceResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update maintenance request";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const startMaintenance = async (id: string): Promise<StartMaintenanceResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Maintenance.Start}/${id}`,
      baseURL,
    });
    return response as StartMaintenanceResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to start maintenance";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const completeMaintenance = async (id: string): Promise<CompleteMaintenanceResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Maintenance.Complete}/${id}`,
      baseURL,
    });
    return response as CompleteMaintenanceResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to complete maintenance";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteMaintenance = async (id: string): Promise<DeleteMaintenanceResponse> => {
  try {
    const response = await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Maintenance.Delete}/${id}`,
      baseURL,
    });
    return response as DeleteMaintenanceResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete maintenance request";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
