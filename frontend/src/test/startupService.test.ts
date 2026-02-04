import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startupService } from '../services/api/startupService';
import apiClient from '../services/api/apiClient';

// Mock apiClient
vi.mock('../services/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('startupService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllStartups', () => {
    it('should fetch all startups with pagination', async () => {
      const mockResponse = {
        data: {
          content: [
            { id: '1', companyName: 'Test Startup 1', stage: 'Seed' },
            { id: '2', companyName: 'Test Startup 2', stage: 'Series A' },
          ],
          totalElements: 2,
          totalPages: 1,
          currentPage: 0,
        },
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await startupService.getAllStartups(0, 10);

      expect(apiClient.get).toHaveBeenCalledWith('/startups', {
        params: { page: 0, size: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getStartupById', () => {
    it('should fetch a single startup by id', async () => {
      const mockStartup = {
        id: '123',
        companyName: 'Test Startup',
        description: 'A test startup',
        stage: 'Seed',
        fundingGoal: 500000,
        currentFunding: 100000,
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStartup });

      const result = await startupService.getStartupById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/startups/123');
      expect(result).toEqual(mockStartup);
    });

    it('should throw error when startup not found', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Not found'));

      await expect(startupService.getStartupById('999')).rejects.toThrow('Not found');
    });
  });

  describe('createStartup', () => {
    it('should create a new startup', async () => {
      const newStartup = {
        companyName: 'New Startup',
        description: 'A new startup',
        stage: 'Pre-seed',
        fundingGoal: 250000,
      };

      const mockResponse = {
        data: { id: '456', ...newStartup, currentFunding: 0 },
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await startupService.createStartup(newStartup);

      expect(apiClient.post).toHaveBeenCalledWith('/startups', newStartup);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateStartup', () => {
    it('should update an existing startup', async () => {
      const updateData = {
        companyName: 'Updated Startup Name',
        description: 'Updated description',
      };

      const mockResponse = {
        data: { id: '123', ...updateData, stage: 'Seed' },
      };

      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await startupService.updateStartup('123', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/startups/123', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteStartup', () => {
    it('should delete a startup', async () => {
      (apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await startupService.deleteStartup('123');

      expect(apiClient.delete).toHaveBeenCalledWith('/startups/123');
    });
  });

  describe('getStartupsByUserId', () => {
    it('should fetch startups by user id', async () => {
      const mockStartups = [
        { id: '1', companyName: 'My Startup 1' },
        { id: '2', companyName: 'My Startup 2' },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStartups });

      const result = await startupService.getStartupsByUserId('user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/startups/user/user-123');
      expect(result).toEqual(mockStartups);
    });
  });
});
