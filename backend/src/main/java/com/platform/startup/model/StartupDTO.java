package com.platform.startup.model;

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
public class StartupDTO {
    private UUID id;
    private UUID userId;
    private String companyName;
    private String description;
    private String stage;
    private BigDecimal fundingGoal;
    private BigDecimal currentFunding;
    private String website;
    private String linkedinUrl;
    private String pitchDeckUrl;
    private StartupStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
