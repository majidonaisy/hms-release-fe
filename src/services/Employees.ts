import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddEmployeeRequest, AddTeamMemberResponse, GetEmployeeByIdResponse, GetEmployeesResponse, PaginatedActivityLogs } from "@/validation/schemas/Employees";
import { getAuthServiceUrl } from "./configServices";

const baseURL = await getAuthServiceUrl();

interface GetEmployeesParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
}

export const getEmployees = async (params?: GetEmployeesParams): Promise<GetEmployeesResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Employees.GetAll,
      baseURL,
      params,
    });
    return response as GetEmployeesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get employees";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getEmployeeById = async (id: string): Promise<GetEmployeeByIdResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Employees.GetEmployeeById}/${id}`,
      baseURL,
    });
    return response as GetEmployeeByIdResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get employee";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getActivityLogs = async (
  id: string,
  skip: number,
  limit: number
): Promise<PaginatedActivityLogs> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Employees.ActivityLog}/${id}`,
      baseURL,
      params: { skip, limit },
    });
    return response as PaginatedActivityLogs;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get employee";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const addTeamMember = async (data: AddEmployeeRequest): Promise<AddTeamMemberResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Employees.Create,
      baseURL,
      data
    });
    return response as AddTeamMemberResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to create employee";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const searchEmployees = async (params: { q: string }): Promise<GetEmployeesResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Employees.Search,
      baseURL,
      params,
    });
    return response as GetEmployeesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to search employees";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateEmployee = async (id: string, data: any): Promise<any> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Employees.DeleteUpdate}/${id}`,
      data,
      baseURL,
    })
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update employee";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const deleteEMployee = async (id: string): Promise<any> => {
  try {
    const response = await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Employees.DeleteUpdate}/${id}`,
      baseURL,
    })
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete employee";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}