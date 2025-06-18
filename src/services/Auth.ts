import { AddUserFormData, LoginFormData, LoginResponse } from '@/validation/schemas';
import { apiClient } from '../api/base';
import { ENDPOINTS } from '../api/endpoints';

export const loginService = async (credentials: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient({
        method: 'POST',
        endpoint: ENDPOINTS.Auth.Login,
        data: credentials,
    });
    return response as LoginResponse;
};

export const addUser = async (token: string, data: AddUserFormData) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'POST',
        endpoint: ENDPOINTS.Auth.AddUser,
        token,
        data
    });
    return response;
};