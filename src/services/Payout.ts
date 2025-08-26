import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { getPaymentServiceUrl } from "./configServices";

const baseURL = await getPaymentServiceUrl();
console.log(baseURL)

export const getPayouts = async (): Promise<any> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Payout,
            baseURL,
        });
        return response;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get payouts";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};