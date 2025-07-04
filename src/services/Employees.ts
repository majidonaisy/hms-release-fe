import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { GetEmployeeByIdResponse, GetEmployeesResponse } from "@/validation/schemas/Employees";
const baseURL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const getEmployees = async (): Promise<GetEmployeesResponse> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Employees.GetAll,
            baseURL
        });
        return response as GetEmployeesResponse;
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to get employees";
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
            baseURL
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