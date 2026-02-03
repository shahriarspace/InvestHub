import { Investor, InvestorStatus, PaginatedResponse } from '../../types';
export declare const investorService: {
    getAllInvestors: (page?: number, size?: number) => Promise<PaginatedResponse<Investor>>;
    getInvestorById: (id: string) => Promise<Investor>;
    getInvestorByUserId: (userId: string) => Promise<Investor>;
    getInvestorsByStatus: (status: InvestorStatus, page?: number, size?: number) => Promise<PaginatedResponse<Investor>>;
    createInvestor: (investor: Partial<Investor>) => Promise<Investor>;
    updateInvestor: (id: string, investor: Partial<Investor>) => Promise<Investor>;
    deleteInvestor: (id: string) => Promise<void>;
};
