import apiClient from './apiClient';

export interface Notification {
  id: string;
  userId: string;
  type: 'OFFER_RECEIVED' | 'OFFER_ACCEPTED' | 'OFFER_REJECTED' | 'MESSAGE_RECEIVED' | 'SYSTEM';
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications');
    return response.data;
  },

  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/notifications/unread');
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    const response = await apiClient.put<{ success: boolean }>(`/notifications/${notificationId}/read`);
    return response.data.success;
  },

  async markAllAsRead(): Promise<number> {
    const response = await apiClient.put<{ markedCount: number }>('/notifications/read-all');
    return response.data.markedCount;
  },
};

export default notificationService;
