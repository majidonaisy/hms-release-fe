import axios, { AxiosError } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions {
    method: HttpMethod;
    endpoint: string;
    data?: unknown;
    token?: string;
    params?: unknown;
}

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.example.com';

export const apiClient = async ({ method, endpoint, data, params, token }: ApiOptions): Promise<unknown> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };


    if (token) {    
        headers['Authorization'] = `Bearer ${token}`;
    }

    let url = `${BASE_URL}${endpoint}`;

    if (params && method === 'GET') {
        const queryString = new URLSearchParams(params as string).toString();
        url += `?${queryString}`;
    }

    const options = {
        method,
        url,
        headers,
        params,
        data,
    };

    try {
        const response = await axios(options);
        return response.data;

    } catch (error: unknown) {
        const axiosError = error as AxiosError;

        // if (axiosError.response?.status === 401) {
        //     try {
        //         const { refreshToken } = store.getState().auth;
        //     if (!refreshToken || isTokenExpired(refreshToken)) {
        //     throw new Error('Refresh token expired or missing');
        //     }
        //         const { accessToken } = await refreshTokenService(refreshToken);

        //         store.dispatch(updateAccessToken(accessToken));

        //         return apiClient({
        //             method,
        //             endpoint,
        //             data,
        //             params,
        //             token: accessToken,
        //         });

        //     } catch (refreshError) {
        //         console.error('Refresh token failed:', refreshError);
        //         store.dispatch(logout());
        //         window.location.href = '/';
        //         throw refreshError;
        //     }
        // }
        throw error;
    }
};