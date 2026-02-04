import apiClient from './apiClient';

export interface PlatformStats {
  totalStartups: number;
  totalInvestors: number;
  totalOffers: number;
  totalFundingRaised: number;
  acceptedOffersCount: number;
  averageOfferAmount: number;
  activeUsers: number;
}

export interface InvestmentTrend {
  month: number;
  year: number;
  offerCount: number;
  totalAmount: number;
  acceptedCount: number;
  monthName: string;
}

export interface StageDistribution {
  stage: string;
  startupCount: number;
  averageFunding: number;
  totalFunding: number;
  percentage: number;
}

export interface SectorDistribution {
  sector: string;
  startupCount: number;
  totalFunding: number;
  percentage: number;
}

export interface TopStartup {
  id: string;
  companyName: string;
  stage: string;
  currentFunding: number;
  fundingGoal: number;
  fundingProgress: number;
  offerCount: number;
}

export interface TopInvestor {
  id: string;
  name: string;
  totalInvested: number;
  offersMade: number;
  offersAccepted: number;
  sectorsInterested: string[];
}

export const analyticsService = {
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await apiClient.get<PlatformStats>('/analytics/platform-stats');
    return response.data;
  },

  async getInvestmentTrends(months: number = 12): Promise<InvestmentTrend[]> {
    const response = await apiClient.get<InvestmentTrend[]>(`/analytics/investment-trends?months=${months}`);
    return response.data;
  },

  async getStageDistribution(): Promise<StageDistribution[]> {
    const response = await apiClient.get<StageDistribution[]>('/analytics/stage-distribution');
    return response.data;
  },

  async getSectorDistribution(): Promise<SectorDistribution[]> {
    const response = await apiClient.get<SectorDistribution[]>('/analytics/sector-distribution');
    return response.data;
  },

  async getTopStartups(limit: number = 10): Promise<TopStartup[]> {
    const response = await apiClient.get<TopStartup[]>(`/analytics/top-startups?limit=${limit}`);
    return response.data;
  },

  async getTopInvestors(limit: number = 10): Promise<TopInvestor[]> {
    const response = await apiClient.get<TopInvestor[]>(`/analytics/top-investors?limit=${limit}`);
    return response.data;
  },
};

export default analyticsService;
