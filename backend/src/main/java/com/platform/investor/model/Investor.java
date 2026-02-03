package com.platform.investor.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "investors")
public class Investor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private UUID userId;

    private BigDecimal investmentBudget;

    @Column(columnDefinition = "TEXT")
    private String investmentStage;

    @Column(columnDefinition = "TEXT")
    private String sectorsInterested;

    private BigDecimal minTicketSize;
    private BigDecimal maxTicketSize;

    @Column(columnDefinition = "TEXT")
    private String portfolioCompanies;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvestorStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Investor() {}

    public Investor(UUID userId, BigDecimal investmentBudget, String investmentStage,
                    String sectorsInterested, InvestorStatus status) {
        this.userId = userId;
        this.investmentBudget = investmentBudget;
        this.investmentStage = investmentStage;
        this.sectorsInterested = sectorsInterested;
        this.status = status;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public BigDecimal getInvestmentBudget() { return investmentBudget; }
    public String getInvestmentStage() { return investmentStage; }
    public String getSectorsInterested() { return sectorsInterested; }
    public BigDecimal getMinTicketSize() { return minTicketSize; }
    public BigDecimal getMaxTicketSize() { return maxTicketSize; }
    public String getPortfolioCompanies() { return portfolioCompanies; }
    public InvestorStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public void setInvestmentBudget(BigDecimal investmentBudget) { this.investmentBudget = investmentBudget; }
    public void setInvestmentStage(String investmentStage) { this.investmentStage = investmentStage; }
    public void setSectorsInterested(String sectorsInterested) { this.sectorsInterested = sectorsInterested; }
    public void setMinTicketSize(BigDecimal minTicketSize) { this.minTicketSize = minTicketSize; }
    public void setMaxTicketSize(BigDecimal maxTicketSize) { this.maxTicketSize = maxTicketSize; }
    public void setPortfolioCompanies(String portfolioCompanies) { this.portfolioCompanies = portfolioCompanies; }
    public void setStatus(InvestorStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
