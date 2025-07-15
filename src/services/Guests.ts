import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddGroupProfileRequest, AddGroupProfileResponse, AddGuestRequest, AddGuestResponse, GetGroupProfilesResponse, GetGuestByIdResponse, GetGuestsResponse, GroupProfileResponse, LinkGuestsToGroupResponse, UpdateGuestRequest, UpdateGuestResponse } from "@/validation/schemas/Guests";
const baseURL = import.meta.env.VITE_CUSTOMER_SERVICE_URL;

export const addGuest = async (data: AddGuestRequest): Promise<AddGuestResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Guest.Add,
      baseURL,
      data,
    });
    return response as AddGuestResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

interface GetGuestsParams {
  page?: number;
  limit?: number;
}

export const getGuests = async (params?: GetGuestsParams): Promise<GetGuestsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Guest.GetAll,
      baseURL,
      params,
    });
    return response as GetGuestsResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get guests";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getGroupProfiles = async (params?: GetGuestsParams): Promise<GetGroupProfilesResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Guest.GetGroupProfiles,
      baseURL,
      params,
    });
    return response as GetGroupProfilesResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get group profiles";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getGuestById = async (id: string): Promise<GetGuestByIdResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Guest.GetById}/${id}`,
      baseURL,
    });
    return response as GetGuestByIdResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const getGroupProfileById = async (id: string): Promise<GroupProfileResponse> => {
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: `${ENDPOINTS.Guest.GetGroupProfileById}/${id}`,
      baseURL,
    })
    return response as GroupProfileResponse
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to link guests to group";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const updateGuest = async (id: string, data: UpdateGuestRequest): Promise<UpdateGuestResponse> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.Guest.Update}/${id}`,
      data,
      baseURL,
    });
    return response as UpdateGuestResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteGuest = async (id: string): Promise<void> => {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Guest.Delete}/${id}`,
      baseURL,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete guest";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const addGroupProfile = async (data: AddGroupProfileRequest): Promise<AddGroupProfileResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Guest.AddGroupProfile,
      baseURL,
      data,
    });
    return response as AddGroupProfileResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add group profile";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const linkGuestsToGroup = async (guestIds: string[], groupId: string): Promise<LinkGuestsToGroupResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: `${ENDPOINTS.Guest.LinkGuestsToGroup}/${groupId}`,
      baseURL,
      data: { guestIds },
    });
    return response as LinkGuestsToGroupResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to link guests to group";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};