import apiClient from './apiClient';
import { Message, Conversation } from '../../types';

export const messagingService = {
  // Create or get existing conversation between two users
  getOrCreateConversation: async (user1Id: string, user2Id: string): Promise<Conversation> => {
    const response = await apiClient.post('/messages/conversations', null, {
      params: { user1Id, user2Id }
    });
    return response.data;
  },
  getConversationById: async (conversationId: string): Promise<Conversation> => {
    const response = await apiClient.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },
  getUserConversations: async (userId: string, page: number = 0, size: number = 20) => {
    const response = await apiClient.get(`/messages/conversations/user/${userId}`, { params: { page, size } });
    return response.data;
  },
  sendMessage: async (message: { conversationId: string; senderId: string; content: string }): Promise<Message> => {
    const response = await apiClient.post('/messages', message);
    return response.data;
  },
  getMessages: async (conversationId: string, page: number = 0, size: number = 50) => {
    const response = await apiClient.get(`/messages/${conversationId}`, { params: { page, size } });
    return response.data;
  },
  getUnreadMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await apiClient.get(`/messages/${conversationId}/unread`);
    return response.data;
  },
  markMessageAsRead: async (messageId: string): Promise<Message> => {
    const response = await apiClient.put(`/messages/${messageId}/read`);
    return response.data;
  },
  markAllAsRead: async (conversationId: string): Promise<void> => {
    await apiClient.put(`/messages/${conversationId}/read-all`);
  },
  deleteMessage: async (messageId: string): Promise<void> => {
    await apiClient.delete(`/messages/${messageId}`);
  },
};
