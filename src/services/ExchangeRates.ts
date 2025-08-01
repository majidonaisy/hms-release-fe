import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { ExchangeRateRequest, ExchangeRateResponse, GetExchangeRateByIdResponse, GetExchangeRateResponse } from "@/validation/schemas/ExchangeRates";

const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export const addExchangeRate = async (data: ExchangeRateRequest): Promise<ExchangeRateResponse> => {
    try {
        const response = await apiClient({
            method: "POST",
            endpoint: ENDPOINTS.ExchangeRate.Add,
            data,
            baseURL,
        });
        return response as ExchangeRateResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to add exchange rate";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

interface GetExchangeRateParams {
    page?: number;
    limit?: number;
}

export const getExchangeRates = async (params?: GetExchangeRateParams): Promise<GetExchangeRateResponse> => {
    try {
        const response = await apiClient({
            method: "GET",
            endpoint: ENDPOINTS.ExchangeRate.Get,
            baseURL,
            params,
        });
        return response as GetExchangeRateResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get exchange rates";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const getExchangeRateById = async (id: string): Promise<GetExchangeRateByIdResponse> => {
    try {
        const response = (await apiClient({
            method: "GET",
            endpoint: `${ENDPOINTS.ExchangeRate.GetById}/${id}`,
            baseURL,
        })) as any;
        return response as GetExchangeRateByIdResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to get exchange rate";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};

export const updateExchangeRate = async (id: string, data: ExchangeRateRequest): Promise<ExchangeRateResponse> => {
    try {
        const response = await apiClient({
            method: "PUT",
            endpoint: `${ENDPOINTS.ExchangeRate.Update}/${id}`,
            data,
            baseURL,
        });
        return response as ExchangeRateResponse;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to update exchange rate";
        throw {
            userMessage: errorMessage,
            originalError: error,
        };
    }
};