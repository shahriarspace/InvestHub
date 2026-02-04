import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from '../services/api/analyticsService';
import apiClient from '../services/api/apiClient';

// Mock apiClient
vi.mock('../services/api/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPlatformStats', () => {
    it('should fetch platform statistics', async () => {
      const mockStats = {
        totalStartups: 50,
        totalInvestors: 25,
        totalOffers: 100,
        totalFundingRaised: 5000000,
        acceptedOffersCount: 30,
        averageOfferAmount: 150000,
        activeUsers: 75,
      };

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockStats });

      const result = await analyticsService.getPlatformStats();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/platform-stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getInvestmentTrends', () => {
    it('should fetch investment trends for specified months', async () => {
      const mockTrends = [
        { month: 1, year: 2025, offerCount: 10, totalAmount: 500000, acceptedCount: 3 },
        { month: 2, year: 2025, offerCount: 15, totalAmount: 750000, acceptedCount: 5 },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockTrends });

      const result = await analyticsService.getInvestmentTrends(6);

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/investment-trends?months=6');
      expect(result).toEqual(mockTrends);
    });

    it('should default to 12 months', async () => {
      const mockTrends = [];
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockTrends });

      await analyticsService.getInvestmentTrends();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/investment-trends?months=12');
    });
  });

  describe('getStageDistribution', () => {
    it('should fetch stage distribution data', async () => {
      const mockDistribution = [
        { stage: 'Seed', startupCount: 20, averageFunding: 100000, percentage: 40 },
        { stage: 'Series A', startupCount: 15, averageFunding: 500000, percentage: 30 },
        { stage: 'Pre-seed', startupCount: 15, averageFunding: 50000, percentage: 30 },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockDistribution });

      const result = await analyticsService.getStageDistribution();

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/stage-distribution');
      expect(result).toEqual(mockDistribution);
    });
  });

  describe('getTopStartups', () => {
    it('should fetch top startups with specified limit', async () => {
      const mockTopStartups = [
        { id: '1', companyName: 'Top Startup 1', currentFunding: 500000, fundingProgress: 80 },
        { id: '2', companyName: 'Top Startup 2', currentFunding: 400000, fundingProgress: 60 },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockTopStartups });

      const result = await analyticsService.getTopStartups(5);

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/top-startups?limit=5');
      expect(result).toEqual(mockTopStartups);
    });
  });

  describe('getTopInvestors', () => {
    it('should fetch top investors with specified limit', async () => {
      const mockTopInvestors = [
        { id: '1', name: 'Investor 1', totalInvested: 1000000, offersMade: 10 },
        { id: '2', name: 'Investor 2', totalInvested: 800000, offersMade: 8 },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockTopInvestors });

      const result = await analyticsService.getTopInvestors(5);

      expect(apiClient.get).toHaveBeenCalledWith('/analytics/top-investors?limit=5');
      expect(result).toEqual(mockTopInvestors);
    });
  });
});
