import apiClient from './apiClient';
import { Message, Conversation } from '../../types';

export const messagingService = {
  createConversation: async (participantIds: string[]): Promise<Conversation> => {
    const response = await apiClient.post('/messages/conversations', { participantIds });
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
  sendMessage: async (message: Partial<Message>): Promise<Message> => {
    const response = await apiClient.post('/messages', message);
    return response.data;
  },
  getMessages: async (conversationId: string, page: number = 0, size: number = 20) => {
    const response = await apiClient.get(`/messages/${conversationId}`, { params: { page, size } });
    return response.data;
  },
  getUnreadCount: async (conversationId: string): Promise<number> => {
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
