import apiClient from './apiClient';
export const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },
    register: async (data) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },
    logout: async () => {
        await apiClient.post('/auth/logout');
    },
    refreshToken: async () => {
        const response = await apiClient.post('/auth/refresh');
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
    // For Google OAuth
    googleLogin: async (googleToken) => {
        const response = await apiClient.post('/auth/google', { token: googleToken });
        return response.data;
    },
};
