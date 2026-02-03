package com.platform.investor.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestorDTO {
    private UUID id;
    private UUID userId;
    private BigDecimal investmentBudget;
    private String investmentStage;
    private String sectorsInterested;
    private BigDecimal minTicketSize;
    private BigDecimal maxTicketSize;
    private String portfolioCompanies;
    private InvestorStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
