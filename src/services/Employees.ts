import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddEmployeeRequest, AddTeamMemberResponse, GetEmployeeByIdResponse, GetEmployeesResponse } from "@/validation/schemas/Employees";
const baseURL = import.meta.env.VITE_AUTH_SERVICE_URL;

interface GetEmployeesParams {
  page?: number;
  limit?: number;
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