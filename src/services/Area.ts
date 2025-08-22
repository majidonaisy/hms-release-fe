import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddAreaResponse, Areas } from "@/validation/schemas/Area";
import { getFrontdeskServiceUrl } from "./configServices";

const baseURL = await getFrontdeskServiceUrl();

export const getAllAreas = async (params?: string): Promise<Areas> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Area.GetAll,
            baseURL,
            params
        });
        return response as Areas;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return {
                data: [],
                message: "No areas found",
                status: 404
            } as Areas;
        }

        const errorMessage = error.response?.data?.message || "Failed to get areas";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const addArea = async (data: { name: string; status: string }): Promise<AddAreaResponse> => {
    try {
        const response = await apiClient({
            method: "POST",
            endpoint: ENDPOINTS.Area.Add,
            data,
            baseURL,
        });
        return response as AddAreaResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to add area";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const deleteArea = async (id: string): Promise<void> => {
    try {
        await apiClient({
            method: "DELETE",
            endpoint: `${ENDPOINTS.Area.Delete}/${id}`,
            baseURL,
        });
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to delete area";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const updateArea = async (id: string, data: { name: string; status: string }): Promise<AddAreaResponse> => {
    try {
        const response = await apiClient({
            method: "PUT",
            endpoint: `${ENDPOINTS.Area.Update}/${id}`,
            data,
            baseURL,
        });
        return response as AddAreaResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to update area";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};