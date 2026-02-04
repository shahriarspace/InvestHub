import { describe, it, expect, vi, beforeEach } from 'vitest';
import { notificationService } from '../services/api/notificationService';
import apiClient from '../services/api/apiClient';

// Mock apiClient
vi.mock('../services/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should fetch all notifications', async () => {
      const mockNotifications = [
        {
          id: '1',
          type: 'OFFER_RECEIVED',
          title: 'New Offer',
          message: 'You received a new offer',
          isRead: false,
          createdAt: '2025-02-04T12:00:00Z',
        },
        {
          id: '2',
          type: 'MESSAGE_RECEIVED',
          title: 'New Message',
          message: 'You have a new message',
          isRead: true,
          createdAt: '2025-02-03T10:00:00Z',
        },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockNotifications });

      const result = await notificationService.getNotifications();

      expect(apiClient.get).toHaveBeenCalledWith('/notifications');
      expect(result).toEqual(mockNotifications);
    });
  });

  describe('getUnreadCount', () => {
    it('should fetch unread notification count', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { count: 5 } });

      const result = await notificationService.getUnreadCount();

      expect(apiClient.get).toHaveBeenCalledWith('/notifications/unread-count');
      expect(result).toBe(5);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { success: true } });

      const result = await notificationService.markAsRead('notif-123');

      expect(apiClient.put).toHaveBeenCalledWith('/notifications/notif-123/read');
      expect(result).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { markedCount: 3 } });

      const result = await notificationService.markAllAsRead();

      expect(apiClient.put).toHaveBeenCalledWith('/notifications/read-all');
      expect(result).toBe(3);
    });
  });
});
