package com.platform.investment.service;

import com.platform.email.service.EmailService;
import com.platform.investment.model.InvestmentOffer;
import com.platform.investment.model.InvestmentOfferDTO;
import com.platform.investment.model.OfferStatus;
import com.platform.investment.repository.InvestmentOfferRepository;
import com.platform.investor.model.Investor;
import com.platform.investor.repository.InvestorRepository;
import com.platform.notification.service.NotificationService;
import com.platform.startup.model.Startup;
import com.platform.startup.repository.StartupRepository;
import com.platform.user.model.User;
import com.platform.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvestmentOfferService {
    
    @Autowired
    private InvestmentOfferRepository investmentOfferRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private StartupRepository startupRepository;
    
    @Autowired
    private InvestorRepository investorRepository;
    
    @Autowired
    private UserRepository userRepository;
    
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
        
        InvestmentOffer savedOffer = investmentOfferRepository.save(offer);
        
        // Send notification and email to startup owner
        try {
            notifyStartupOwnerOfNewOffer(savedOffer);
        } catch (Exception e) {
            // Log but don't fail the offer creation
        }
        
        return savedOffer;
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
            InvestmentOffer savedOffer = investmentOfferRepository.save(o);
            
            // Notify investor
            try {
                notifyInvestorOfOfferStatus(savedOffer, true);
            } catch (Exception e) {
                // Log but don't fail
            }
            
            return savedOffer;
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
            InvestmentOffer savedOffer = investmentOfferRepository.save(o);
            
            // Notify investor
            try {
                notifyInvestorOfOfferStatus(savedOffer, false);
            } catch (Exception e) {
                // Log but don't fail
            }
            
            return savedOffer;
        }
        return null;
    }
    
    private void notifyStartupOwnerOfNewOffer(InvestmentOffer offer) {
        // Get startup and its owner
        Startup startup = startupRepository.findById(offer.getIdeaId()).orElse(null);
        if (startup == null) return;
        
        User startupOwner = userRepository.findById(startup.getUserId()).orElse(null);
        if (startupOwner == null) return;
        
        // Get investor name
        Investor investor = investorRepository.findById(offer.getInvestorId()).orElse(null);
        String investorName = "An investor";
        if (investor != null) {
            User investorUser = userRepository.findById(investor.getUserId()).orElse(null);
            if (investorUser != null) {
                investorName = investorUser.getFirstName() + " " + investorUser.getLastName();
            }
        }
        
        // Send notification
        notificationService.notifyOfferReceived(
            startupOwner.getId(),
            investorName,
            startup.getCompanyName(),
            offer.getId()
        );
        
        // Send email
        emailService.sendOfferReceivedEmail(
            startupOwner.getEmail(),
            investorName,
            startup.getCompanyName(),
            formatCurrency(offer.getOfferedAmount())
        );
    }
    
    private void notifyInvestorOfOfferStatus(InvestmentOffer offer, boolean accepted) {
        // Get investor
        Investor investor = investorRepository.findById(offer.getInvestorId()).orElse(null);
        if (investor == null) return;
        
        User investorUser = userRepository.findById(investor.getUserId()).orElse(null);
        if (investorUser == null) return;
        
        // Get startup name
        Startup startup = startupRepository.findById(offer.getIdeaId()).orElse(null);
        String startupName = startup != null ? startup.getCompanyName() : "Unknown Startup";
        
        // Send notification
        if (accepted) {
            notificationService.notifyOfferAccepted(investorUser.getId(), startupName, offer.getId());
            emailService.sendOfferAcceptedEmail(
                investorUser.getEmail(),
                startupName,
                formatCurrency(offer.getOfferedAmount())
            );
        } else {
            notificationService.notifyOfferRejected(investorUser.getId(), startupName, offer.getId());
            emailService.sendOfferRejectedEmail(
                investorUser.getEmail(),
                startupName,
                formatCurrency(offer.getOfferedAmount())
            );
        }
    }
    
    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "$0";
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.US);
        return formatter.format(amount);
    }
}
