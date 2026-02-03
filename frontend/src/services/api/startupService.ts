import apiClient from './apiClient';
import { Startup, StartupStatus, PaginatedResponse } from '../../types';

export const startupService = {
  getAllStartups: async (page: number = 0, size: number = 20): Promise<PaginatedResponse<Startup>> => {
    const response = await apiClient.get('/startups', { params: { page, size } });
    return response.data;
  },
  getStartupById: async (id: string): Promise<Startup> => {
    const response = await apiClient.get(`/startups/${id}`);
    return response.data;
  },
  getStartupsByUserId: async (userId: string, page: number = 0, size: number = 20): Promise<PaginatedResponse<Startup>> => {
    const response = await apiClient.get(`/startups/user/${userId}`, { params: { page, size } });
    return response.data;
  },
  getStartupsByStatus: async (status: StartupStatus, page: number = 0, size: number = 20): Promise<PaginatedResponse<Startup>> => {
    const response = await apiClient.get(`/startups/status/${status}`, { params: { page, size } });
    return response.data;
  },
  createStartup: async (startup: Partial<Startup>): Promise<Startup> => {
    const response = await apiClient.post('/startups', startup);
    return response.data;
  },
  updateStartup: async (id: string, startup: Partial<Startup>): Promise<Startup> => {
    const response = await apiClient.put(`/startups/${id}`, startup);
    return response.data;
  },
  deleteStartup: async (id: string): Promise<void> => {
    await apiClient.delete(`/startups/${id}`);
  },
};
