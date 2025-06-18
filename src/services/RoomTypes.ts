import { apiClient } from '../api/base';
import { ENDPOINTS } from '../api/endpoints';
import { RoomTypeFormData } from '@/validation';

export const createRoomType = async (data: RoomTypeFormData, token: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'POST',
        endpoint: ENDPOINTS.RoomType.Add,
        data,
        token
    });
    return response; return response;
};

export const getRoomTypes = async (token: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'GET',
        endpoint: ENDPOINTS.RoomType.GetAll,
        token
    });
    return response; return response;
};

export const getRoomTypeById = async (token: string, roomId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'GET',
        endpoint: ENDPOINTS.RoomType.GetById + `/${roomId}`,
        token,
    });
    return response; return response;
};

export const updateRoomType = async (token: string, roomId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'PUT',
        endpoint: ENDPOINTS.RoomType.Update + `/${roomId}`,
        token,
    });
    return response; return response;
};

export const deleteRoomType = async (token: string, roomId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'DELETE',
        endpoint: ENDPOINTS.RoomType.Delete + `/${roomId}`,
        token,
    });
    return response; return response;
};