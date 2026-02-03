import apiClient from './apiClient';
import { User, UserRole, UserStatus, PaginatedResponse } from '../../types';

export const userService = {
  // Get all users
  getAllUsers: async (page: number = 0, size: number = 20): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get('/users', {
      params: { page, size },
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<User> => {
    const response = await apiClient.get(`/users/email/${email}`);
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role: UserRole, page: number = 0, size: number = 20): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get(`/users/role/${role}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get users by status
  getUsersByStatus: async (status: UserStatus, page: number = 0, size: number = 20): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get(`/users/status/${status}`, {
      params: { page, size },
    });
    return response.data;
  },

  // Create user
  createUser: async (user: Partial<User>): Promise<User> => {
    const response = await apiClient.post('/users', user);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, user);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
