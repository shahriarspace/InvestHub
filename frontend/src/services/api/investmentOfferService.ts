import apiClient from './apiClient';
import { InvestmentOffer, OfferStatus, PaginatedResponse } from '../../types';

export const investmentOfferService = {
  getAllOffers: async (page: number = 0, size: number = 20): Promise<PaginatedResponse<InvestmentOffer>> => {
    const response = await apiClient.get('/investment-offers', { params: { page, size } });
    return response.data;
  },
  getOfferById: async (id: string): Promise<InvestmentOffer> => {
    const response = await apiClient.get(`/investment-offers/${id}`);
    return response.data;
  },
  getOffersByIdeaId: async (ideaId: string, page: number = 0, size: number = 20): Promise<PaginatedResponse<InvestmentOffer>> => {
    const response = await apiClient.get(`/investment-offers/idea/${ideaId}`, { params: { page, size } });
    return response.data;
  },
  getOffersByInvestorId: async (investorId: string, page: number = 0, size: number = 20): Promise<PaginatedResponse<InvestmentOffer>> => {
    const response = await apiClient.get(`/investment-offers/investor/${investorId}`, { params: { page, size } });
    return response.data;
  },
  getOffersByStatus: async (status: OfferStatus, page: number = 0, size: number = 20): Promise<PaginatedResponse<InvestmentOffer>> => {
    const response = await apiClient.get(`/investment-offers/status/${status}`, { params: { page, size } });
    return response.data;
  },
  createOffer: async (offer: Partial<InvestmentOffer>): Promise<InvestmentOffer> => {
    const response = await apiClient.post('/investment-offers', offer);
    return response.data;
  },
  updateOffer: async (id: string, offer: Partial<InvestmentOffer>): Promise<InvestmentOffer> => {
    const response = await apiClient.put(`/investment-offers/${id}`, offer);
    return response.data;
  },
  acceptOffer: async (id: string): Promise<InvestmentOffer> => {
    const response = await apiClient.put(`/investment-offers/${id}/accept`);
    return response.data;
  },
  rejectOffer: async (id: string): Promise<InvestmentOffer> => {
    const response = await apiClient.put(`/investment-offers/${id}/reject`);
    return response.data;
  },
  deleteOffer: async (id: string): Promise<void> => {
    await apiClient.delete(`/investment-offers/${id}`);
  },
};
