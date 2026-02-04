import { describe, it, expect, vi, beforeEach } from 'vitest';
import { investorService } from '../services/api/investorService';
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

describe('investorService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllInvestors', () => {
    it('should fetch all investors with pagination', async () => {
      const mockResponse = {
        data: {
          content: [
            { id: '1', investmentBudget: 5000000, investmentStage: 'Seed' },
            { id: '2', investmentBudget: 2000000, investmentStage: 'Series A' },
          ],
          totalElements: 2,
          totalPages: 1,
        },
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await investorService.getAllInvestors(0, 10);

      expect(apiClient.get).toHaveBeenCalledWith('/investors', {
        params: { page: 0, size: 10 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getInvestorById', () => {
    it('should fetch a single investor by id', async () => {
      const mockInvestor = {
        id: '123',
        investmentBudget: 5000000,
        investmentStage: 'Seed, Series A',
        sectorsInterested: 'Technology, AI/ML',
        minTicketSize: 50000,
        maxTicketSize: 500000,
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockInvestor });

      const result = await investorService.getInvestorById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/investors/123');
      expect(result).toEqual(mockInvestor);
    });
  });

  describe('createInvestor', () => {
    it('should create a new investor profile', async () => {
      const newInvestor = {
        investmentBudget: 1000000,
        investmentStage: 'Pre-seed',
        sectorsInterested: 'Healthcare',
        minTicketSize: 25000,
        maxTicketSize: 100000,
      };

      const mockResponse = {
        data: { id: '456', ...newInvestor },
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await investorService.createInvestor(newInvestor);

      expect(apiClient.post).toHaveBeenCalledWith('/investors', newInvestor);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateInvestor', () => {
    it('should update an existing investor', async () => {
      const updateData = {
        investmentBudget: 2000000,
        sectorsInterested: 'Technology, Healthcare',
      };

      const mockResponse = {
        data: { id: '123', ...updateData },
      };

      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await investorService.updateInvestor('123', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/investors/123', updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getInvestorByUserId', () => {
    it('should fetch investor by user id', async () => {
      const mockInvestor = {
        id: '123',
        userId: 'user-123',
        investmentBudget: 5000000,
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockInvestor });

      const result = await investorService.getInvestorByUserId('user-123');

      expect(apiClient.get).toHaveBeenCalledWith('/investors/user/user-123');
      expect(result).toEqual(mockInvestor);
    });

    it('should return null when investor not found', async () => {
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue({ response: { status: 404 } });

      const result = await investorService.getInvestorByUserId('user-999');

      expect(result).toBeNull();
    });
  });
});
