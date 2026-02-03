package com.platform.investor.service;

import com.platform.investor.model.Investor;
import com.platform.investor.model.InvestorDTO;
import com.platform.investor.model.InvestorStatus;
import com.platform.investor.repository.InvestorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvestorService {
    
    @Autowired
    private InvestorRepository investorRepository;
    
    /**
     * Get investor by ID
     */
    public Optional<Investor> getInvestorById(UUID id) {
        return investorRepository.findById(id);
    }
    
    /**
     * Get investor by user ID
     */
    public Optional<Investor> getInvestorByUserId(UUID userId) {
        return investorRepository.findByUserId(userId);
    }
    
    /**
     * Create a new investor profile
     */
    public Investor createInvestor(InvestorDTO investorDTO) {
        Investor investor = new Investor();
        investor.setUserId(investorDTO.getUserId());
        investor.setInvestmentBudget(investorDTO.getInvestmentBudget());
        investor.setInvestmentStage(investorDTO.getInvestmentStage());
        investor.setSectorsInterested(investorDTO.getSectorsInterested());
        investor.setMinTicketSize(investorDTO.getMinTicketSize());
        investor.setMaxTicketSize(investorDTO.getMaxTicketSize());
        investor.setStatus(investorDTO.getStatus() != null ? investorDTO.getStatus() : InvestorStatus.ACTIVE);
        
        return investorRepository.save(investor);
    }
    
    /**
     * Update existing investor
     */
    public Investor updateInvestor(UUID id, InvestorDTO investorDTO) {
        Optional<Investor> existingInvestor = investorRepository.findById(id);
        if (existingInvestor.isPresent()) {
            Investor investor = existingInvestor.get();
            if (investorDTO.getInvestmentBudget() != null) {
                investor.setInvestmentBudget(investorDTO.getInvestmentBudget());
            }
            if (investorDTO.getInvestmentStage() != null) {
                investor.setInvestmentStage(investorDTO.getInvestmentStage());
            }
            if (investorDTO.getSectorsInterested() != null) {
                investor.setSectorsInterested(investorDTO.getSectorsInterested());
            }
            if (investorDTO.getMinTicketSize() != null) {
                investor.setMinTicketSize(investorDTO.getMinTicketSize());
            }
            if (investorDTO.getMaxTicketSize() != null) {
                investor.setMaxTicketSize(investorDTO.getMaxTicketSize());
            }
            if (investorDTO.getPortfolioCompanies() != null) {
                investor.setPortfolioCompanies(investorDTO.getPortfolioCompanies());
            }
            if (investorDTO.getStatus() != null) {
                investor.setStatus(investorDTO.getStatus());
            }
            return investorRepository.save(investor);
        }
        return null;
    }
    
    /**
     * Delete investor
     */
    public boolean deleteInvestor(UUID id) {
        if (investorRepository.existsById(id)) {
            investorRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Get investors by status
     */
    public Page<Investor> getInvestorsByStatus(InvestorStatus status, Pageable pageable) {
        return investorRepository.findByStatus(status, pageable);
    }
    
    /**
     * Get all investors with pagination
     */
    public Page<Investor> getAllInvestors(Pageable pageable) {
        return investorRepository.findAll(pageable);
    }
}
