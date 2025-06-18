import { apiClient } from '../api/base';
import { ENDPOINTS } from '../api/endpoints';
import { RoomFormData } from '@/validation';

export const createRoom = async (data: RoomFormData, token: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'POST',
        endpoint: ENDPOINTS.Room.Add,
        data,
        token
    });
    return response; return response;
};

export const getRooms = async (token: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'GET',
        endpoint: ENDPOINTS.Room.GetAll,
        token
    });
    return response; return response;
};

export const getRoomById = async (token: string, roomId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'GET',
        endpoint: ENDPOINTS.Room.GetById + `/${roomId}`,
        token,
    });
    return response; return response;
};

export const getRoomByStatus = async (token: string, status: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'GET',
        endpoint: ENDPOINTS.Room.GetByStatus + `/${status}`,
        token,
    });
    return response; return response;
};

export const updateRoom = async (token: string, roomId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'PUT',
        endpoint: ENDPOINTS.Room.Update + `/${roomId}`,
        token,
    });
    return response; return response;
};

export const deleteRoom = async (token: string, roomId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'DELETE',
        endpoint: ENDPOINTS.Room.Delete + `/${roomId}`,
        token,
    });
    return response; return response;
};