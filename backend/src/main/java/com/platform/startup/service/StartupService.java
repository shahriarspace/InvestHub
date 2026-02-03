package com.platform.startup.service;

import com.platform.startup.model.Startup;
import com.platform.startup.model.StartupDTO;
import com.platform.startup.model.StartupStatus;
import com.platform.startup.repository.StartupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StartupService {
    
    @Autowired
    private StartupRepository startupRepository;
    
    /**
     * Get startup by ID
     */
    public Optional<Startup> getStartupById(UUID id) {
        return startupRepository.findById(id);
    }
    
    /**
     * Get all startups by user ID
     */
    public List<Startup> getStartupsByUserId(UUID userId) {
        return startupRepository.findByUserId(userId);
    }
    
    /**
     * Get startup by ID and user ID (ensures user owns startup)
     */
    public Optional<Startup> getStartupByIdAndUserId(UUID id, UUID userId) {
        return startupRepository.findByIdAndUserId(id, userId);
    }
    
    /**
     * Create a new startup
     */
    public Startup createStartup(StartupDTO startupDTO) {
        Startup startup = new Startup();
        startup.setUserId(startupDTO.getUserId());
        startup.setCompanyName(startupDTO.getCompanyName());
        startup.setDescription(startupDTO.getDescription());
        startup.setStage(startupDTO.getStage());
        startup.setFundingGoal(startupDTO.getFundingGoal());
        startup.setWebsite(startupDTO.getWebsite());
        startup.setLinkedinUrl(startupDTO.getLinkedinUrl());
        startup.setPitchDeckUrl(startupDTO.getPitchDeckUrl());
        startup.setStatus(startupDTO.getStatus() != null ? startupDTO.getStatus() : StartupStatus.DRAFT);
        
        return startupRepository.save(startup);
    }
    
    /**
     * Update existing startup
     */
    public Startup updateStartup(UUID id, StartupDTO startupDTO) {
        Optional<Startup> existingStartup = startupRepository.findById(id);
        if (existingStartup.isPresent()) {
            Startup startup = existingStartup.get();
            if (startupDTO.getCompanyName() != null) {
                startup.setCompanyName(startupDTO.getCompanyName());
            }
            if (startupDTO.getDescription() != null) {
                startup.setDescription(startupDTO.getDescription());
            }
            if (startupDTO.getStage() != null) {
                startup.setStage(startupDTO.getStage());
            }
            if (startupDTO.getFundingGoal() != null) {
                startup.setFundingGoal(startupDTO.getFundingGoal());
            }
            if (startupDTO.getWebsite() != null) {
                startup.setWebsite(startupDTO.getWebsite());
            }
            if (startupDTO.getLinkedinUrl() != null) {
                startup.setLinkedinUrl(startupDTO.getLinkedinUrl());
            }
            if (startupDTO.getPitchDeckUrl() != null) {
                startup.setPitchDeckUrl(startupDTO.getPitchDeckUrl());
            }
            if (startupDTO.getStatus() != null) {
                startup.setStatus(startupDTO.getStatus());
            }
            return startupRepository.save(startup);
        }
        return null;
    }
    
    /**
     * Delete startup
     */
    public boolean deleteStartup(UUID id) {
        if (startupRepository.existsById(id)) {
            startupRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Get all startups by status
     */
    public Page<Startup> getStartupsByStatus(StartupStatus status, Pageable pageable) {
        return startupRepository.findByStatus(status, pageable);
    }
    
    /**
     * Get all startups with pagination
     */
    public Page<Startup> getAllStartups(Pageable pageable) {
        return startupRepository.findAll(pageable);
    }
}
