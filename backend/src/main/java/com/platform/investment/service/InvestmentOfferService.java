package com.platform.investment.service;

import com.platform.investment.model.InvestmentOffer;
import com.platform.investment.model.InvestmentOfferDTO;
import com.platform.investment.model.OfferStatus;
import com.platform.investment.repository.InvestmentOfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvestmentOfferService {
    
    @Autowired
    private InvestmentOfferRepository investmentOfferRepository;
    
    /**
     * Get investment offer by ID
     */
    public Optional<InvestmentOffer> getOfferById(UUID id) {
        return investmentOfferRepository.findById(id);
    }
    
    /**
     * Get all offers for a specific idea
     */
    public List<InvestmentOffer> getOffersByIdeaId(UUID ideaId) {
        return investmentOfferRepository.findByIdeaId(ideaId);
    }
    
    /**
     * Get all offers from a specific investor
     */
    public List<InvestmentOffer> getOffersByInvestorId(UUID investorId) {
        return investmentOfferRepository.findByInvestorId(investorId);
    }
    
    /**
     * Get offer by ID and investor ID (ensures investor owns offer)
     */
    public Optional<InvestmentOffer> getOfferByIdAndInvestorId(UUID id, UUID investorId) {
        return investmentOfferRepository.findByIdAndInvestorId(id, investorId);
    }
    
    /**
     * Create a new investment offer
     */
    public InvestmentOffer createOffer(InvestmentOfferDTO offerDTO) {
        InvestmentOffer offer = new InvestmentOffer();
        offer.setInvestorId(offerDTO.getInvestorId());
        offer.setIdeaId(offerDTO.getIdeaId());
        offer.setOfferedAmount(offerDTO.getOfferedAmount());
        offer.setEquityPercentage(offerDTO.getEquityPercentage());
        offer.setValuation(offerDTO.getValuation());
        offer.setMessage(offerDTO.getMessage());
        offer.setStatus(offerDTO.getStatus() != null ? offerDTO.getStatus() : OfferStatus.PENDING);
        offer.setExpiresAt(offerDTO.getExpiresAt());
        
        return investmentOfferRepository.save(offer);
    }
    
    /**
     * Update existing offer
     */
    public InvestmentOffer updateOffer(UUID id, InvestmentOfferDTO offerDTO) {
        Optional<InvestmentOffer> existingOffer = investmentOfferRepository.findById(id);
        if (existingOffer.isPresent()) {
            InvestmentOffer offer = existingOffer.get();
            if (offerDTO.getOfferedAmount() != null) {
                offer.setOfferedAmount(offerDTO.getOfferedAmount());
            }
            if (offerDTO.getEquityPercentage() != null) {
                offer.setEquityPercentage(offerDTO.getEquityPercentage());
            }
            if (offerDTO.getValuation() != null) {
                offer.setValuation(offerDTO.getValuation());
            }
            if (offerDTO.getMessage() != null) {
                offer.setMessage(offerDTO.getMessage());
            }
            if (offerDTO.getStatus() != null) {
                offer.setStatus(offerDTO.getStatus());
            }
            if (offerDTO.getExpiresAt() != null) {
                offer.setExpiresAt(offerDTO.getExpiresAt());
            }
            return investmentOfferRepository.save(offer);
        }
        return null;
    }
    
    /**
     * Delete offer
     */
    public boolean deleteOffer(UUID id) {
        if (investmentOfferRepository.existsById(id)) {
            investmentOfferRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Get offers by status
     */
    public Page<InvestmentOffer> getOffersByStatus(OfferStatus status, Pageable pageable) {
        return investmentOfferRepository.findByStatus(status, pageable);
    }
    
    /**
     * Accept offer
     */
    public InvestmentOffer acceptOffer(UUID id) {
        Optional<InvestmentOffer> offer = investmentOfferRepository.findById(id);
        if (offer.isPresent()) {
            InvestmentOffer o = offer.get();
            o.setStatus(OfferStatus.ACCEPTED);
            return investmentOfferRepository.save(o);
        }
        return null;
    }
    
    /**
     * Reject offer
     */
    public InvestmentOffer rejectOffer(UUID id) {
        Optional<InvestmentOffer> offer = investmentOfferRepository.findById(id);
        if (offer.isPresent()) {
            InvestmentOffer o = offer.get();
            o.setStatus(OfferStatus.REJECTED);
            return investmentOfferRepository.save(o);
        }
        return null;
    }
}
