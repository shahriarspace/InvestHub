package com.platform.admin.service;

import com.platform.admin.model.DashboardStats;
import com.platform.admin.model.UserManagementDTO;
import com.platform.investment.model.InvestmentOffer;
import com.platform.investment.model.OfferStatus;
import com.platform.investment.repository.InvestmentOfferRepository;
import com.platform.investor.model.Investor;
import com.platform.investor.model.InvestorStatus;
import com.platform.investor.repository.InvestorRepository;
import com.platform.startup.model.Startup;
import com.platform.startup.model.StartupStatus;
import com.platform.startup.repository.StartupRepository;
import com.platform.user.model.User;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import com.platform.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private InvestorRepository investorRepository;

    @Autowired
    private InvestmentOfferRepository investmentOfferRepository;

    /**
     * Get comprehensive dashboard statistics
     */
    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // User statistics
        stats.setTotalUsers(userRepository.count());
        stats.setActiveUsers(userRepository.findByStatus(UserStatus.ACTIVE, Pageable.unpaged()).getTotalElements());

        // Startup statistics
        stats.setTotalStartups(startupRepository.count());
        stats.setPublishedStartups(startupRepository.findByStatus(StartupStatus.PUBLISHED, Pageable.unpaged()).getTotalElements());

        // Investor statistics
        stats.setTotalInvestors(investorRepository.count());
        stats.setActiveInvestors(investorRepository.findByStatus(InvestorStatus.ACTIVE, Pageable.unpaged()).getTotalElements());

        // Offer statistics
        stats.setTotalOffers(investmentOfferRepository.count());
        stats.setPendingOffers(investmentOfferRepository.findByStatus(OfferStatus.PENDING, Pageable.unpaged()).getTotalElements());
        stats.setAcceptedOffers(investmentOfferRepository.findByStatus(OfferStatus.ACCEPTED, Pageable.unpaged()).getTotalElements());

        // Funding statistics
        List<Startup> allStartups = startupRepository.findAll();
        BigDecimal totalGoal = allStartups.stream()
                .map(s -> s.getFundingGoal() != null ? s.getFundingGoal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalRaised = allStartups.stream()
                .map(s -> s.getCurrentFunding() != null ? s.getCurrentFunding() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalFundingGoal(totalGoal);
        stats.setTotalFundingRaised(totalRaised);

        // Users by role
        Map<String, Long> usersByRole = new HashMap<>();
        for (UserRole role : UserRole.values()) {
            usersByRole.put(role.name(), userRepository.findByUserRole(role, Pageable.unpaged()).getTotalElements());
        }
        stats.setUsersByRole(usersByRole);

        // Startups by stage
        Map<String, Long> startupsByStage = allStartups.stream()
                .filter(s -> s.getStage() != null)
                .collect(Collectors.groupingBy(Startup::getStage, Collectors.counting()));
        stats.setStartupsByStage(startupsByStage);

        // Offers by status
        Map<String, Long> offersByStatus = new HashMap<>();
        for (OfferStatus status : OfferStatus.values()) {
            offersByStatus.put(status.name(), investmentOfferRepository.findByStatus(status, Pageable.unpaged()).getTotalElements());
        }
        stats.setOffersByStatus(offersByStatus);

        return stats;
    }

    /**
     * Get all users with optional filters
     */
    public Page<UserManagementDTO> getAllUsers(String role, String status, String search, Pageable pageable) {
        Page<User> users;
        
        if (role != null && !role.isEmpty()) {
            try {
                UserRole userRole = UserRole.valueOf(role.toUpperCase());
                users = userRepository.findByUserRole(userRole, pageable);
            } catch (IllegalArgumentException e) {
                users = userRepository.findAll(pageable);
            }
        } else if (status != null && !status.isEmpty()) {
            try {
                UserStatus userStatus = UserStatus.valueOf(status.toUpperCase());
                users = userRepository.findByStatus(userStatus, pageable);
            } catch (IllegalArgumentException e) {
                users = userRepository.findAll(pageable);
            }
        } else {
            users = userRepository.findAll(pageable);
        }

        // Filter by search if provided
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            List<UserManagementDTO> filteredList = users.getContent().stream()
                    .filter(u -> u.getEmail().toLowerCase().contains(searchLower) ||
                            (u.getFirstName() != null && u.getFirstName().toLowerCase().contains(searchLower)) ||
                            (u.getLastName() != null && u.getLastName().toLowerCase().contains(searchLower)))
                    .map(this::convertToUserManagementDTO)
                    .collect(Collectors.toList());
            return new PageImpl<>(filteredList, pageable, filteredList.size());
        }

        return users.map(this::convertToUserManagementDTO);
    }

    /**
     * Get user by ID with admin details
     */
    public Optional<UserManagementDTO> getUserById(UUID id) {
        return userRepository.findById(id).map(this::convertToUserManagementDTO);
    }

    /**
     * Update user status
     */
    public UserManagementDTO updateUserStatus(UUID id, UserStatus newStatus) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setStatus(newStatus);
            User savedUser = userRepository.save(user);
            return convertToUserManagementDTO(savedUser);
        }
        return null;
    }

    /**
     * Delete user permanently
     */
    public boolean deleteUser(UUID id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Get all startups with filters
     */
    public Page<Startup> getAllStartups(String status, String search, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            try {
                StartupStatus startupStatus = StartupStatus.valueOf(status.toUpperCase());
                return startupRepository.findByStatus(startupStatus, pageable);
            } catch (IllegalArgumentException e) {
                // Invalid status, return all
            }
        }
        return startupRepository.findAll(pageable);
    }

    /**
     * Update startup status
     */
    public Startup updateStartupStatus(UUID id, String status) {
        Optional<Startup> startupOpt = startupRepository.findById(id);
        if (startupOpt.isPresent()) {
            Startup startup = startupOpt.get();
            try {
                StartupStatus newStatus = StartupStatus.valueOf(status.toUpperCase());
                startup.setStatus(newStatus);
                return startupRepository.save(startup);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Get all investors with filters
     */
    public Page<Investor> getAllInvestors(String status, String search, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            try {
                InvestorStatus investorStatus = InvestorStatus.valueOf(status.toUpperCase());
                return investorRepository.findByStatus(investorStatus, pageable);
            } catch (IllegalArgumentException e) {
                // Invalid status, return all
            }
        }
        return investorRepository.findAll(pageable);
    }

    /**
     * Get all investment offers with filters
     */
    public Page<InvestmentOffer> getAllOffers(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            try {
                OfferStatus offerStatus = OfferStatus.valueOf(status.toUpperCase());
                return investmentOfferRepository.findByStatus(offerStatus, pageable);
            } catch (IllegalArgumentException e) {
                // Invalid status, return all
            }
        }
        return investmentOfferRepository.findAll(pageable);
    }

    /**
     * Get activity logs (placeholder - would need AuditLog entity)
     */
    public Page<Map<String, Object>> getActivityLogs(String type, Pageable pageable) {
        // This would integrate with an audit log system
        // For now, return empty page
        return Page.empty(pageable);
    }

    // Helper method to convert User to UserManagementDTO
    private UserManagementDTO convertToUserManagementDTO(User user) {
        UserManagementDTO dto = new UserManagementDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setUserRole(user.getUserRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        // Get startup info if user is a startup owner
        if (user.getUserRole() == UserRole.STARTUP) {
            List<Startup> startups = startupRepository.findByUserId(user.getId());
            if (!startups.isEmpty()) {
                dto.setStartupName(startups.get(0).getCompanyName());
            }
        }

        // Get investor info if user is an investor
        if (user.getUserRole() == UserRole.INVESTOR) {
            investorRepository.findByUserId(user.getId()).ifPresent(investor -> {
                dto.setInvestorCompany("Investor Profile");
            });
        }

        return dto;
    }
}
