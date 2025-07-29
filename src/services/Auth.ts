import {  AddUserRequest, AddUserResponse, LoginRequest, LoginResponse } from '@/validation/schemas';
import { apiClient } from '@/api/base';
import { ENDPOINTS } from '@/api/endpoints';

const baseURL = import.meta.env.VITE_AUTH_SERVICE_URL;

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