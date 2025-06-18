import {  AddUserRequest, AddUserResponse, LoginRequest, LoginResponse } from '@/validation/schemas';
import { apiClient } from '@/api/base';
import { ENDPOINTS } from '@/api/endpoints';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient({
      method: "POST",
      endpoint: ENDPOINTS.Auth.Login,
      data,
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