package com.platform.user.model;

import jakarta.persistence.*;




import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")




public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private UUID userId;

    private String bio;
    private String website;
    private String location;
    private String phoneNumber;

    // Startup specific
    private String companyName;
    private Integer foundedYear;
    private Integer teamSize;
    private String stage;

    // Investor specific
    private java.math.BigDecimal investmentBudget;
    private java.math.BigDecimal minTicketSize;
    private java.math.BigDecimal maxTicketSize;

    @Column(columnDefinition = "TEXT")
    private String sectorsInterested;

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
