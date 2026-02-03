import apiClient from './apiClient';
export const userService = {
    // Get all users
    getAllUsers: async (page = 0, size = 20) => {
        const response = await apiClient.get('/users', {
            params: { page, size },
        });
        return response.data;
    },
    // Get user by ID
    getUserById: async (id) => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },
    // Get user by email
    getUserByEmail: async (email) => {
        const response = await apiClient.get(`/users/email/${email}`);
        return response.data;
    },
    // Get users by role
    getUsersByRole: async (role, page = 0, size = 20) => {
        const response = await apiClient.get(`/users/role/${role}`, {
            params: { page, size },
        });
        return response.data;
    },
    // Get users by status
    getUsersByStatus: async (status, page = 0, size = 20) => {
        const response = await apiClient.get(`/users/status/${status}`, {
            params: { page, size },
        });
        return response.data;
    },
    // Create user
    createUser: async (user) => {
        const response = await apiClient.post('/users', user);
        return response.data;
    },
    // Update user
    updateUser: async (id, user) => {
        const response = await apiClient.put(`/users/${id}`, user);
        return response.data;
    },
    // Delete user
    deleteUser: async (id) => {
        await apiClient.delete(`/users/${id}`);
    },
};
