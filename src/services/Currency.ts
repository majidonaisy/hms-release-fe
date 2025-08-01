import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { GetCurrenciesResponse } from "@/validation/schemas/Currency";

const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

export const getAddChargeCurrencies = async () => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Currency.GetAddChargeCurrencies,
      baseURL,
    });
    return response as GetCurrenciesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Login failed";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const convertRate = async (data: { baseCurrency: string; targetCurrency: string; amount: number }) => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Currency.Convert}`,
      baseURL,
      data,
    });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to fetch exchange rate";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

