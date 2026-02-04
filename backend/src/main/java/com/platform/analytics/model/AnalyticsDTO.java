package com.platform.analytics.model;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsDTO {

    // Platform-wide statistics
    public static class PlatformStats {
        private long totalStartups;
        private long totalInvestors;
        private long totalOffers;
        private BigDecimal totalFundingRaised;
        private long acceptedOffersCount;
        private BigDecimal averageOfferAmount;
        private long activeUsers;

        public PlatformStats() {}

        // Getters and Setters
        public long getTotalStartups() { return totalStartups; }
        public void setTotalStartups(long totalStartups) { this.totalStartups = totalStartups; }
        public long getTotalInvestors() { return totalInvestors; }
        public void setTotalInvestors(long totalInvestors) { this.totalInvestors = totalInvestors; }
        public long getTotalOffers() { return totalOffers; }
        public void setTotalOffers(long totalOffers) { this.totalOffers = totalOffers; }
        public BigDecimal getTotalFundingRaised() { return totalFundingRaised; }
        public void setTotalFundingRaised(BigDecimal totalFundingRaised) { this.totalFundingRaised = totalFundingRaised; }
        public long getAcceptedOffersCount() { return acceptedOffersCount; }
        public void setAcceptedOffersCount(long acceptedOffersCount) { this.acceptedOffersCount = acceptedOffersCount; }
        public BigDecimal getAverageOfferAmount() { return averageOfferAmount; }
        public void setAverageOfferAmount(BigDecimal averageOfferAmount) { this.averageOfferAmount = averageOfferAmount; }
        public long getActiveUsers() { return activeUsers; }
        public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    }

    // Monthly investment trends
    public static class InvestmentTrend {
        private int month;
        private int year;
        private long offerCount;
        private BigDecimal totalAmount;
        private long acceptedCount;
        private String monthName;

        public InvestmentTrend() {}

        public InvestmentTrend(int month, int year, long offerCount, BigDecimal totalAmount, long acceptedCount) {
            this.month = month;
            this.year = year;
            this.offerCount = offerCount;
            this.totalAmount = totalAmount;
            this.acceptedCount = acceptedCount;
            this.monthName = getMonthName(month);
        }

        private String getMonthName(int month) {
            String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
            return months[month - 1];
        }

        // Getters and Setters
        public int getMonth() { return month; }
        public void setMonth(int month) { this.month = month; }
        public int getYear() { return year; }
        public void setYear(int year) { this.year = year; }
        public long getOfferCount() { return offerCount; }
        public void setOfferCount(long offerCount) { this.offerCount = offerCount; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public long getAcceptedCount() { return acceptedCount; }
        public void setAcceptedCount(long acceptedCount) { this.acceptedCount = acceptedCount; }
        public String getMonthName() { return monthName; }
        public void setMonthName(String monthName) { this.monthName = monthName; }
    }

    // Sector distribution
    public static class SectorDistribution {
        private String sector;
        private long startupCount;
        private BigDecimal totalFunding;
        private double percentage;

        public SectorDistribution() {}

        public SectorDistribution(String sector, long startupCount, BigDecimal totalFunding) {
            this.sector = sector;
            this.startupCount = startupCount;
            this.totalFunding = totalFunding;
        }

        // Getters and Setters
        public String getSector() { return sector; }
        public void setSector(String sector) { this.sector = sector; }
        public long getStartupCount() { return startupCount; }
        public void setStartupCount(long startupCount) { this.startupCount = startupCount; }
        public BigDecimal getTotalFunding() { return totalFunding; }
        public void setTotalFunding(BigDecimal totalFunding) { this.totalFunding = totalFunding; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    // Stage distribution
    public static class StageDistribution {
        private String stage;
        private long startupCount;
        private BigDecimal averageFunding;
        private BigDecimal totalFunding;
        private double percentage;

        public StageDistribution() {}

        public StageDistribution(String stage, long startupCount, BigDecimal averageFunding, BigDecimal totalFunding) {
            this.stage = stage;
            this.startupCount = startupCount;
            this.averageFunding = averageFunding;
            this.totalFunding = totalFunding;
        }

        // Getters and Setters
        public String getStage() { return stage; }
        public void setStage(String stage) { this.stage = stage; }
        public long getStartupCount() { return startupCount; }
        public void setStartupCount(long startupCount) { this.startupCount = startupCount; }
        public BigDecimal getAverageFunding() { return averageFunding; }
        public void setAverageFunding(BigDecimal averageFunding) { this.averageFunding = averageFunding; }
        public BigDecimal getTotalFunding() { return totalFunding; }
        public void setTotalFunding(BigDecimal totalFunding) { this.totalFunding = totalFunding; }
        public double getPercentage() { return percentage; }
        public void setPercentage(double percentage) { this.percentage = percentage; }
    }

    // Top startup
    public static class TopStartup {
        private String id;
        private String companyName;
        private String stage;
        private BigDecimal currentFunding;
        private BigDecimal fundingGoal;
        private double fundingProgress;
        private int offerCount;

        public TopStartup() {}

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public String getStage() { return stage; }
        public void setStage(String stage) { this.stage = stage; }
        public BigDecimal getCurrentFunding() { return currentFunding; }
        public void setCurrentFunding(BigDecimal currentFunding) { this.currentFunding = currentFunding; }
        public BigDecimal getFundingGoal() { return fundingGoal; }
        public void setFundingGoal(BigDecimal fundingGoal) { this.fundingGoal = fundingGoal; }
        public double getFundingProgress() { return fundingProgress; }
        public void setFundingProgress(double fundingProgress) { this.fundingProgress = fundingProgress; }
        public int getOfferCount() { return offerCount; }
        public void setOfferCount(int offerCount) { this.offerCount = offerCount; }
    }

    // Top investor
    public static class TopInvestor {
        private String id;
        private String name;
        private BigDecimal totalInvested;
        private int offersMade;
        private int offersAccepted;
        private List<String> sectorsInterested;

        public TopInvestor() {}

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public BigDecimal getTotalInvested() { return totalInvested; }
        public void setTotalInvested(BigDecimal totalInvested) { this.totalInvested = totalInvested; }
        public int getOffersMade() { return offersMade; }
        public void setOffersMade(int offersMade) { this.offersMade = offersMade; }
        public int getOffersAccepted() { return offersAccepted; }
        public void setOffersAccepted(int offersAccepted) { this.offersAccepted = offersAccepted; }
        public List<String> getSectorsInterested() { return sectorsInterested; }
        public void setSectorsInterested(List<String> sectorsInterested) { this.sectorsInterested = sectorsInterested; }
    }
}
