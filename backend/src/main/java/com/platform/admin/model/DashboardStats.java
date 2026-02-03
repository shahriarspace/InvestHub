package com.platform.admin.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class DashboardStats {
    private long totalUsers;
    private long activeUsers;
    private long totalStartups;
    private long publishedStartups;
    private long totalInvestors;
    private long activeInvestors;
    private long totalOffers;
    private long pendingOffers;
    private long acceptedOffers;
    private BigDecimal totalFundingGoal;
    private BigDecimal totalFundingRaised;
    private List<Map<String, Object>> recentActivity;
    private Map<String, Long> usersByRole;
    private Map<String, Long> startupsByStage;
    private Map<String, Long> offersByStatus;
    private LocalDateTime lastUpdated;

    // Constructors
    public DashboardStats() {
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters
    public long getTotalUsers() { return totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public long getTotalStartups() { return totalStartups; }
    public long getPublishedStartups() { return publishedStartups; }
    public long getTotalInvestors() { return totalInvestors; }
    public long getActiveInvestors() { return activeInvestors; }
    public long getTotalOffers() { return totalOffers; }
    public long getPendingOffers() { return pendingOffers; }
    public long getAcceptedOffers() { return acceptedOffers; }
    public BigDecimal getTotalFundingGoal() { return totalFundingGoal; }
    public BigDecimal getTotalFundingRaised() { return totalFundingRaised; }
    public List<Map<String, Object>> getRecentActivity() { return recentActivity; }
    public Map<String, Long> getUsersByRole() { return usersByRole; }
    public Map<String, Long> getStartupsByStage() { return startupsByStage; }
    public Map<String, Long> getOffersByStatus() { return offersByStatus; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }

    // Setters
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    public void setTotalStartups(long totalStartups) { this.totalStartups = totalStartups; }
    public void setPublishedStartups(long publishedStartups) { this.publishedStartups = publishedStartups; }
    public void setTotalInvestors(long totalInvestors) { this.totalInvestors = totalInvestors; }
    public void setActiveInvestors(long activeInvestors) { this.activeInvestors = activeInvestors; }
    public void setTotalOffers(long totalOffers) { this.totalOffers = totalOffers; }
    public void setPendingOffers(long pendingOffers) { this.pendingOffers = pendingOffers; }
    public void setAcceptedOffers(long acceptedOffers) { this.acceptedOffers = acceptedOffers; }
    public void setTotalFundingGoal(BigDecimal totalFundingGoal) { this.totalFundingGoal = totalFundingGoal; }
    public void setTotalFundingRaised(BigDecimal totalFundingRaised) { this.totalFundingRaised = totalFundingRaised; }
    public void setRecentActivity(List<Map<String, Object>> recentActivity) { this.recentActivity = recentActivity; }
    public void setUsersByRole(Map<String, Long> usersByRole) { this.usersByRole = usersByRole; }
    public void setStartupsByStage(Map<String, Long> startupsByStage) { this.startupsByStage = startupsByStage; }
    public void setOffersByStatus(Map<String, Long> offersByStatus) { this.offersByStatus = offersByStatus; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}
