package com.platform.startup.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "startups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Startup {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String stage;
    private BigDecimal fundingGoal;
    private BigDecimal currentFunding;
    private String website;
    private String linkedinUrl;
    private String pitchDeckUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StartupStatus status;

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
