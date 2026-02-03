package com.platform.investment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "investment_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestmentOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID investorId;

    @Column(nullable = false)
    private UUID ideaId;

    @Column(nullable = false)
    private BigDecimal offeredAmount;

    @Column(nullable = false)
    private BigDecimal equityPercentage;

    private BigDecimal valuation;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status;

    private LocalDateTime expiresAt;

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
}
