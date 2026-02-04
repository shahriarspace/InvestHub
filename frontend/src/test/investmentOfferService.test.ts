import { describe, it, expect, vi, beforeEach } from 'vitest';
import { investmentOfferService } from '../services/api/investmentOfferService';
import apiClient from '../services/api/apiClient';

// Mock apiClient
vi.mock('../services/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe('investmentOfferService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOffer', () => {
    it('should create a new investment offer', async () => {
      const newOffer = {
        investorId: 'investor-123',
        ideaId: 'startup-456',
        offeredAmount: 100000,
        equityPercentage: 5,
        message: 'Interested in investing',
      };

      const mockResponse = {
        data: {
          id: 'offer-789',
          ...newOffer,
          status: 'PENDING',
          createdAt: '2025-02-04T12:00:00Z',
        },
      };

      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await investmentOfferService.createOffer(newOffer);

      expect(apiClient.post).toHaveBeenCalledWith('/investment-offers', newOffer);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getOffersByInvestorId', () => {
    it('should fetch offers by investor id', async () => {
      const mockOffers = [
        { id: '1', offeredAmount: 100000, status: 'PENDING' },
        { id: '2', offeredAmount: 200000, status: 'ACCEPTED' },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockOffers });

      const result = await investmentOfferService.getOffersByInvestorId('investor-123');

      expect(apiClient.get).toHaveBeenCalledWith('/investment-offers/investor/investor-123');
      expect(result).toEqual(mockOffers);
    });
  });

  describe('getOffersByIdeaId', () => {
    it('should fetch offers by startup/idea id', async () => {
      const mockOffers = [
        { id: '1', offeredAmount: 100000, status: 'PENDING' },
        { id: '2', offeredAmount: 150000, status: 'REJECTED' },
      ];

      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockOffers });

      const result = await investmentOfferService.getOffersByIdeaId('startup-456');

      expect(apiClient.get).toHaveBeenCalledWith('/investment-offers/idea/startup-456');
      expect(result).toEqual(mockOffers);
    });
  });

  describe('acceptOffer', () => {
    it('should accept an offer', async () => {
      const mockResponse = {
        data: {
          id: 'offer-789',
          status: 'ACCEPTED',
        },
      };

      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await investmentOfferService.acceptOffer('offer-789');

      expect(apiClient.put).toHaveBeenCalledWith('/investment-offers/offer-789/accept');
      expect(result.status).toBe('ACCEPTED');
    });
  });

  describe('rejectOffer', () => {
    it('should reject an offer', async () => {
      const mockResponse = {
        data: {
          id: 'offer-789',
          status: 'REJECTED',
        },
      };

      (apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

      const result = await investmentOfferService.rejectOffer('offer-789');

      expect(apiClient.put).toHaveBeenCalledWith('/investment-offers/offer-789/reject');
      expect(result.status).toBe('REJECTED');
    });
  });
});
