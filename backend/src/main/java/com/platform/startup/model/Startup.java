package com.platform.startup.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "startups")
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

    // Constructors
    public Startup() {}

    public Startup(UUID userId, String companyName, String description, String stage,
                   BigDecimal fundingGoal, String website, StartupStatus status) {
        this.userId = userId;
        this.companyName = companyName;
        this.description = description;
        this.stage = stage;
        this.fundingGoal = fundingGoal;
        this.website = website;
        this.status = status;
        this.currentFunding = BigDecimal.ZERO;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public String getCompanyName() { return companyName; }
    public String getDescription() { return description; }
    public String getStage() { return stage; }
    public BigDecimal getFundingGoal() { return fundingGoal; }
    public BigDecimal getCurrentFunding() { return currentFunding; }
    public String getWebsite() { return website; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public String getPitchDeckUrl() { return pitchDeckUrl; }
    public StartupStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setDescription(String description) { this.description = description; }
    public void setStage(String stage) { this.stage = stage; }
    public void setFundingGoal(BigDecimal fundingGoal) { this.fundingGoal = fundingGoal; }
    public void setCurrentFunding(BigDecimal currentFunding) { this.currentFunding = currentFunding; }
    public void setWebsite(String website) { this.website = website; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public void setPitchDeckUrl(String pitchDeckUrl) { this.pitchDeckUrl = pitchDeckUrl; }
    public void setStatus(StartupStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
