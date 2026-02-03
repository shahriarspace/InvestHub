import apiClient from './apiClient';
export const startupService = {
    getAllStartups: async (page = 0, size = 20) => {
        const response = await apiClient.get('/startups', { params: { page, size } });
        return response.data;
    },
    getStartupById: async (id) => {
        const response = await apiClient.get(`/startups/${id}`);
        return response.data;
    },
    getStartupsByUserId: async (userId, page = 0, size = 20) => {
        const response = await apiClient.get(`/startups/user/${userId}`, { params: { page, size } });
        return response.data;
    },
    getStartupsByStatus: async (status, page = 0, size = 20) => {
        const response = await apiClient.get(`/startups/status/${status}`, { params: { page, size } });
        return response.data;
    },
    createStartup: async (startup) => {
        const response = await apiClient.post('/startups', startup);
        return response.data;
    },
    updateStartup: async (id, startup) => {
        const response = await apiClient.put(`/startups/${id}`, startup);
        return response.data;
    },
    deleteStartup: async (id) => {
        await apiClient.delete(`/startups/${id}`);
    },
};
