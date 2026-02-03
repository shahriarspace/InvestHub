package com.platform.investment.model;

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
}
