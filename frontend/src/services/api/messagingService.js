import apiClient from './apiClient';
export const messagingService = {
    createConversation: async (participantIds) => {
        const response = await apiClient.post('/messages/conversations', { participantIds });
        return response.data;
    },
    getConversationById: async (conversationId) => {
        const response = await apiClient.get(`/messages/conversations/${conversationId}`);
        return response.data;
    },
    getUserConversations: async (userId, page = 0, size = 20) => {
        const response = await apiClient.get(`/messages/conversations/user/${userId}`, { params: { page, size } });
        return response.data;
    },
    sendMessage: async (message) => {
        const response = await apiClient.post('/messages', message);
        return response.data;
    },
    getMessages: async (conversationId, page = 0, size = 20) => {
        const response = await apiClient.get(`/messages/${conversationId}`, { params: { page, size } });
        return response.data;
    },
    getUnreadCount: async (conversationId) => {
        const response = await apiClient.get(`/messages/${conversationId}/unread`);
        return response.data;
    },
    markMessageAsRead: async (messageId) => {
        const response = await apiClient.put(`/messages/${messageId}/read`);
        return response.data;
    },
    markAllAsRead: async (conversationId) => {
        await apiClient.put(`/messages/${conversationId}/read-all`);
    },
    deleteMessage: async (messageId) => {
        await apiClient.delete(`/messages/${messageId}`);
    },
};
