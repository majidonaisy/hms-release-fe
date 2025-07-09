import { apiClient } from "@/api/base";
import { ENDPOINTS } from "@/api/endpoints";
import { RoleResponse } from "@/validation/schemas/Roles";
const baseURL = import.meta.env.VITE_AUTH_SERVICE_URL;

interface GetRolesParams {
  page?: number;
  limit?: number;
}

export const getRoles = async (params?: GetRolesParams): Promise<RoleResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Role.GetAll,
      baseURL,
      params,
    });
    return response as RoleResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get role";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    await apiClient({
      method: "DELETE",
      endpoint: `${ENDPOINTS.Role.Delete}/${id}`,
      baseURL,
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to delete role";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
