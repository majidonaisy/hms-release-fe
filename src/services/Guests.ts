import { apiClient } from '../api/base';
import { ENDPOINTS } from '../api/endpoints';
import { AddGuestFormData } from '@/validation';

export const addGuest = async (data: AddGuestFormData, token: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'POST',
        endpoint: ENDPOINTS.Guest.Add,
        data,
        token
    });
    return response; return response;
};

export const getGuests = async (token: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'GET',
        endpoint: ENDPOINTS.Guest.GetAll,
        token
    });
    return response; return response;
};

export const getGuestById = async (token: string, guestId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'GET',
        endpoint: ENDPOINTS.Guest.GetById + `/${guestId}`,
        token,
    });
    return response; return response;
};

export const updateGuest = async (token: string, guestId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'PUT',
        endpoint: ENDPOINTS.Guest.Update + `/${guestId}`,
        token,
    });
    return response; return response;
};

export const deleteGuest = async (token: string, guestId: string) => { //add promise and return type when confirmed
    const response = await apiClient({
        method: 'DELETE',
        endpoint: ENDPOINTS.Guest.Delete + `/${guestId}`,
        token,
    });
    return response; return response;
};