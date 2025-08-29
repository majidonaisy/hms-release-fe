import { AddUserRequest, AddUserResponse, GetProfileResponse, LoginRequest, LoginResponse } from '@/validation/schemas';
import { apiClient } from '@/api/base';
import { ENDPOINTS } from '@/api/endpoints';
import { getAuthServiceUrl } from './configServices';

const baseURL = await getAuthServiceUrl();

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Auth.Login,
      data,
      baseURL,
    });
    return response as LoginResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Login failed";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const addUser = async (
  data: AddUserRequest
): Promise<AddUserResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: "/auth/add-user",
      data,
      baseURL
    });
    return response as AddUserResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to add user";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Auth.RefreshToken,
      baseURL,
      data: { refreshToken }
    });
    return response as any;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to refresh token";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
}

export const logoutService = async (): Promise<void> => {
  try {
    await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Auth.Logout,
      baseURL
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Logout failed";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};

export const changePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }): Promise<void> => {
  try {
    await apiClient({
      method: "PUT",
      endpoint: ENDPOINTS.Auth.ChangePassword,
      data,
      baseURL
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to change password";
    const customError = new Error(errorMessage);
    (customError as any).userMessage = errorMessage;
    (customError as any).originalError = error;
    throw customError;
  }
};

export const getProfile = async (): Promise<GetProfileResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: ENDPOINTS.Auth.Profile,
      baseURL
    });
    return response as GetProfileResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get profile";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};