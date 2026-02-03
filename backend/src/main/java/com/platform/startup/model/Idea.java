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
@Table(name = "ideas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Idea {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID startupId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String problemStatement;

    @Column(columnDefinition = "TEXT")
    private String solutionDescription;

    private String targetMarket;
    private String revenueModel;
    private BigDecimal requestedInvestment;
    private BigDecimal equityOffered;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdeaStatus status;

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
