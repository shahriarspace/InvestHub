import { InvestmentOffer, OfferStatus, PaginatedResponse } from '../../types';
export declare const investmentOfferService: {
    getAllOffers: (page?: number, size?: number) => Promise<PaginatedResponse<InvestmentOffer>>;
    getOfferById: (id: string) => Promise<InvestmentOffer>;
    getOffersByIdeaId: (ideaId: string, page?: number, size?: number) => Promise<PaginatedResponse<InvestmentOffer>>;
    getOffersByInvestorId: (investorId: string, page?: number, size?: number) => Promise<PaginatedResponse<InvestmentOffer>>;
    getOffersByStatus: (status: OfferStatus, page?: number, size?: number) => Promise<PaginatedResponse<InvestmentOffer>>;
    createOffer: (offer: Partial<InvestmentOffer>) => Promise<InvestmentOffer>;
    updateOffer: (id: string, offer: Partial<InvestmentOffer>) => Promise<InvestmentOffer>;
    acceptOffer: (id: string) => Promise<InvestmentOffer>;
    rejectOffer: (id: string) => Promise<InvestmentOffer>;
    deleteOffer: (id: string) => Promise<void>;
};
