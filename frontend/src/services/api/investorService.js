import apiClient from './apiClient';
export const investorService = {
    getAllInvestors: async (page = 0, size = 20) => {
        const response = await apiClient.get('/investors', { params: { page, size } });
        return response.data;
    },
    getInvestorById: async (id) => {
        const response = await apiClient.get(`/investors/${id}`);
        return response.data;
    },
    getInvestorByUserId: async (userId) => {
        const response = await apiClient.get(`/investors/user/${userId}`);
        return response.data;
    },
    getInvestorsByStatus: async (status, page = 0, size = 20) => {
        const response = await apiClient.get(`/investors/status/${status}`, { params: { page, size } });
        return response.data;
    },
    createInvestor: async (investor) => {
        const response = await apiClient.post('/investors', investor);
        return response.data;
    },
    updateInvestor: async (id, investor) => {
        const response = await apiClient.put(`/investors/${id}`, investor);
        return response.data;
    },
    deleteInvestor: async (id) => {
        await apiClient.delete(`/investors/${id}`);
    },
};
