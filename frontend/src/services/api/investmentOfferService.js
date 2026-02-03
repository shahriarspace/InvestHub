import apiClient from './apiClient';
export const investmentOfferService = {
    getAllOffers: async (page = 0, size = 20) => {
        const response = await apiClient.get('/investment-offers', { params: { page, size } });
        return response.data;
    },
    getOfferById: async (id) => {
        const response = await apiClient.get(`/investment-offers/${id}`);
        return response.data;
    },
    getOffersByIdeaId: async (ideaId, page = 0, size = 20) => {
        const response = await apiClient.get(`/investment-offers/idea/${ideaId}`, { params: { page, size } });
        return response.data;
    },
    getOffersByInvestorId: async (investorId, page = 0, size = 20) => {
        const response = await apiClient.get(`/investment-offers/investor/${investorId}`, { params: { page, size } });
        return response.data;
    },
    getOffersByStatus: async (status, page = 0, size = 20) => {
        const response = await apiClient.get(`/investment-offers/status/${status}`, { params: { page, size } });
        return response.data;
    },
    createOffer: async (offer) => {
        const response = await apiClient.post('/investment-offers', offer);
        return response.data;
    },
    updateOffer: async (id, offer) => {
        const response = await apiClient.put(`/investment-offers/${id}`, offer);
        return response.data;
    },
    acceptOffer: async (id) => {
        const response = await apiClient.put(`/investment-offers/${id}/accept`);
        return response.data;
    },
    rejectOffer: async (id) => {
        const response = await apiClient.put(`/investment-offers/${id}/reject`);
        return response.data;
    },
    deleteOffer: async (id) => {
        await apiClient.delete(`/investment-offers/${id}`);
    },
};
