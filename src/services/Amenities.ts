import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { Amenity, AmenityResponse } from "@/validation/schemas/amenity";

const baseURL = import.meta.env.VITE_FRONTDESK_SERVICE_URL;

interface GetAmenitiesParams {
  page?: number;
  limit?: number;
}

export const getAmenities = async (params?: GetAmenitiesParams): Promise<AmenityResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Amenities.GetAllAmenities,
      baseURL,
      params,
    });
    return response as AmenityResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get amenities";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const addAmenity = async (data: { name: string }): Promise<Amenity> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Amenities.Add, // This would need to be updated to the correct endpoint
      data,
      baseURL,
    });
    return response as Amenity;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add amenity";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteAmenity = async (id: string): Promise<void> => {
  try {
    // Assuming there's an endpoint for deleting amenities
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Amenities.Delete}/${id}`, // This would need to be updated to the correct endpoint
      baseURL,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete amenity";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};


export const updateAmenity = async (id: string, data: { name: string }): Promise<Amenity> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Amenities.Update}/${id}`,
      data,
      baseURL,
    });
    return response as Amenity;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update amenity";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};