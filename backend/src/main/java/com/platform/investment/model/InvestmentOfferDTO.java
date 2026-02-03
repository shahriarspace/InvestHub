package com.platform.investment.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class InvestmentOfferDTO {
    private UUID id;
    private UUID investorId;
    private UUID ideaId;
    private BigDecimal offeredAmount;
    private BigDecimal equityPercentage;
    private BigDecimal valuation;
    private String message;
    private OfferStatus status;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public InvestmentOfferDTO() {}

    public InvestmentOfferDTO(UUID investorId, UUID ideaId, BigDecimal offeredAmount,
                              BigDecimal equityPercentage, OfferStatus status) {
        this.investorId = investorId;
        this.ideaId = ideaId;
        this.offeredAmount = offeredAmount;
        this.equityPercentage = equityPercentage;
        this.status = status;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getInvestorId() { return investorId; }
    public UUID getIdeaId() { return ideaId; }
    public BigDecimal getOfferedAmount() { return offeredAmount; }
    public BigDecimal getEquityPercentage() { return equityPercentage; }
    public BigDecimal getValuation() { return valuation; }
    public String getMessage() { return message; }
    public OfferStatus getStatus() { return status; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setInvestorId(UUID investorId) { this.investorId = investorId; }
    public void setIdeaId(UUID ideaId) { this.ideaId = ideaId; }
    public void setOfferedAmount(BigDecimal offeredAmount) { this.offeredAmount = offeredAmount; }
    public void setEquityPercentage(BigDecimal equityPercentage) { this.equityPercentage = equityPercentage; }
    public void setValuation(BigDecimal valuation) { this.valuation = valuation; }
    public void setMessage(String message) { this.message = message; }
    public void setStatus(OfferStatus status) { this.status = status; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
