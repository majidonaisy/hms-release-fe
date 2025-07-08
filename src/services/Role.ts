import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { DeleteRoleResponse, AddRoleRequest, UpdateRoleRequest, RoleResponse, AddUpdateRoleResponse, RoleByIdResponse, PermissionsResponse } from "@/validation/schemas/Roles";
const baseURL = import.meta.env.VITE_AUTH_SERVICE_URL;

export const getRoles = async (): Promise<RoleResponse> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Role.GetAll,
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

export const getPermissions = async (): Promise<PermissionsResponse> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Role.GetPermissions,
            baseURL,
        });
        return response as PermissionsResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get permissions";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const addRole = async (data: AddRoleRequest): Promise<AddUpdateRoleResponse> => {
    try {
        const response = await apiClient({
            method: "POST",
            endpoint: ENDPOINTS.Role.Add,
            baseURL,
            data,
        });
        return response as AddUpdateRoleResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to add role";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const getRoleBId = async (id: string): Promise<RoleByIdResponse> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: `${ENDPOINTS.Role.GetById}/${id}`,
            baseURL
        });
        return response as RoleByIdResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get role";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const deleteRole = async (id: string): Promise<DeleteRoleResponse> => {
    try {
        const response = await apiClient({
            method: "DELETE",
            endpoint: `${ENDPOINTS.Role.Delete}/${id}`,
            baseURL
        });
        return response as DeleteRoleResponse
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to delete role";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const updateRole = async (id: string, data: UpdateRoleRequest): Promise<AddUpdateRoleResponse> => {
    try {
        const response = await apiClient({
            method: "PUT",
            endpoint: `${ENDPOINTS.Role.Update}/${id}`,
            baseURL,
            data
        });
        return response as AddUpdateRoleResponse
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to update role";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};