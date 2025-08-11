import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { AddGroupProfileRequest, AddGroupProfileResponse, AddGuestRequest, AddGuestResponse, GetGroupProfilesResponse, GetGuestByIdResponse, GetGuestsResponse, GroupProfileResponse, LinkGuestsToGroupResponse, UpdateGroupProfileRequest, UpdateGuestRequest, UpdateGuestResponse } from "@/validation/schemas/Guests";

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

// Guests Service
export interface GuestSearchParams {
  q?: string;
  page?: number;
  limit?: number;
}

export const searchGuests = async (params: GuestSearchParams): Promise<GetGuestsResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Guest.GetAll,
      baseURL,
      params,
    });
    return response as GetGuestsResponse;
  } catch (error: any) {
    throw {
      userMessage: error.response?.data?.message || "Failed to search guests",
      originalError: error,
    };
  }
};

// GroupProfile Service
export interface GroupProfileSearchParams {
  q?: string;
  page?: number;
  limit?: number;
}

export const searchGroupProfiles = async (params: GroupProfileSearchParams): Promise<GetGroupProfilesResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.GroupProfile.GetGroupProfiles,
      baseURL,
      params,
    });
    return response as GetGroupProfilesResponse;
  } catch (error: any) {
    throw {
      userMessage: error.response?.data?.message || "Failed to search group profiles",
      originalError: error,
    };
  }
};

export interface GetGuestsParams {
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
      endpoint: ENDPOINTS.GroupProfile.GetGroupProfiles,
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
      endpoint: `${ENDPOINTS.GroupProfile.GetGroupProfileById}/${id}`,
      baseURL,
    })
    return response as GroupProfileResponse
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get group profile";
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

export const deleteGroupProfile = async (id: string): Promise<void> => {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.GroupProfile.DeleteGroupProfile}/${id}`,
      baseURL,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete group profile";
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
      endpoint: ENDPOINTS.GroupProfile.AddGroupProfile,
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
      endpoint: `${ENDPOINTS.GroupProfile.LinkGuestsToGroup}/${groupId}`,
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

export const unlinkGuests = async (guestId: string, groupId: string): Promise<any> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.GroupProfile.UnlinkGuests}/${groupId}/${guestId}`,
      baseURL,
    });
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to unlink guests";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const updateGroupProfile = async (id: string, data: UpdateGroupProfileRequest): Promise<any> => {
  try {
    const response = await apiClient({
      method: "PUT",
      endpoint: `${ENDPOINTS.GroupProfile.UpdateGroupProfile}/${id}`,
      baseURL,
      data
    });
    return response
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to update group";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}