import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { getPaymentServiceUrl } from "./configServices";
import { PaymentsResponse } from "@/validation/schemas/Payouts";

const baseURLPromise = getPaymentServiceUrl();

interface GetPayoutsParams {
    from: string;
    to: string;
    page?: number;
    limit?: number;
}

export const getPayouts = async (params: GetPayoutsParams): Promise<PaymentsResponse> => {
    const baseURL = await baseURLPromise;

    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.Payout,
            baseURL,
            params,
        });
        return response as PaymentsResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get payouts";
        throw { userMessage: errorMessage, originalError: error };
    }
};
