import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { HotelSettingsResponse, HousekeepingUsers, UpdateHotelSettingsRequest } from "@/validation/schemas/Hotel";
import { getAuthServiceUrl } from "./configServices";

const baseURL = await getAuthServiceUrl();
// Alaa was here
export const getHotelSettings = async (): Promise<HotelSettingsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Hotel.Get,
      baseURL,
    });
    return response as HotelSettingsResponse;
  } catch (error: any) {
    console.error("Get hotel settings error:", error);
    throw error;
  }
};

export const updateHotelSettings = async (data: UpdateHotelSettingsRequest): Promise<HotelSettingsResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: ENDPOINTS.Hotel.Update,
      data,
      baseURL,
    });
    return response as HotelSettingsResponse;
  } catch (error: any) {
    console.error("Update hotel settings error:", error);
    throw error;
  }
};

export const getHousekeepingUsers = async (): Promise<HousekeepingUsers> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Hotel.HousekeepingUsers,
      baseURL,
    });
    return response as HousekeepingUsers;
  } catch (error: any) {
    console.error("Get housekeeping users error:", error);
    throw error;
  }
};

export const getCountries = async (params: { q: string }): Promise<{ data: { code: string; name: string }[] }> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Hotel.Countries,
      baseURL,
      params,
    });
    return response as { data: { code: string; name: string }[] };
  } catch (error: any) {
    console.error("Get countries error:", error);
    throw error;
  }
};