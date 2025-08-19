import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddDepartmentResponse, Departments } from "@/validation/schemas/Departments";
import { getAuthServiceUrl } from "./configServices";

 const baseURL = await getAuthServiceUrl();

export const getDepartments = async (params?: string): Promise<Departments> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Departments.Manage,
            baseURL,
            params
        });
        return response as Departments;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get departments";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const addDepartment = async (data: { name: string }): Promise<AddDepartmentResponse> => {
    try {
        const response = await apiClient({
            method: "POST",
            endpoint: ENDPOINTS.Departments.Manage,
            data,
            baseURL,
        });
        return response as AddDepartmentResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to add department";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const deleteDepartment = async (id: string): Promise<void> => {
    try {
        await apiClient({
            method: "DELETE",
            endpoint: `${ENDPOINTS.Departments.Manage}/${id}`,
            baseURL,
        });
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to delete department";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const updateDepartment = async (id: string, data: { name: string }): Promise<AddDepartmentResponse> => {
    try {
        const response = await apiClient({
            method: "PUT",
            endpoint: `${ENDPOINTS.Departments.Manage}/${id}`,
            data,
            baseURL,
        });
        return response as AddDepartmentResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to update department";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};