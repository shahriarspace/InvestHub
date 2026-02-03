import apiClient from './apiClient';
import { Investor, InvestorStatus, PaginatedResponse } from '../../types';

export const investorService = {
  getAllInvestors: async (page: number = 0, size: number = 20): Promise<PaginatedResponse<Investor>> => {
    const response = await apiClient.get('/investors', { params: { page, size } });
    return response.data;
  },
  getInvestorById: async (id: string): Promise<Investor> => {
    const response = await apiClient.get(`/investors/${id}`);
    return response.data;
  },
  getInvestorByUserId: async (userId: string): Promise<Investor> => {
    const response = await apiClient.get(`/investors/user/${userId}`);
    return response.data;
  },
  getInvestorsByStatus: async (status: InvestorStatus, page: number = 0, size: number = 20): Promise<PaginatedResponse<Investor>> => {
    const response = await apiClient.get(`/investors/status/${status}`, { params: { page, size } });
    return response.data;
  },
  createInvestor: async (investor: Partial<Investor>): Promise<Investor> => {
    const response = await apiClient.post('/investors', investor);
    return response.data;
  },
  updateInvestor: async (id: string, investor: Partial<Investor>): Promise<Investor> => {
    const response = await apiClient.put(`/investors/${id}`, investor);
    return response.data;
  },
  deleteInvestor: async (id: string): Promise<void> => {
    await apiClient.delete(`/investors/${id}`);
  },
};
