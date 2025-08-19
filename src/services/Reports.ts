import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";

const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export interface Report {
    id: string,
    link: string,
    date: Date
}

export const getReports = async (): Promise<Report[]> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Report,
            baseURL,
        });
        return response as Report[];
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get  reports";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};