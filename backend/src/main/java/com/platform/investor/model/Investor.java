package com.platform.investor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "investors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private UUID userId;

    private BigDecimal investmentBudget;

    @Column(columnDefinition = "jsonb")
    private String investmentStage;

    @Column(columnDefinition = "jsonb")
    private String sectorsInterested;

    private BigDecimal minTicketSize;
    private BigDecimal maxTicketSize;

    @Column(columnDefinition = "jsonb")
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
}
