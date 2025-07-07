import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { RoleResponse } from "@/validation/schemas/Roles";
const baseURL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const getRoles = async (): Promise<RoleResponse> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Role.Get,
            baseURL,
        });
        return response as RoleResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get role";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};