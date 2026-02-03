package com.platform.messaging.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID participant1Id;

    @Column(nullable = false)
    private UUID participant2Id;

    private LocalDateTime lastMessageAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Constructors
    public Conversation() {}

    public Conversation(UUID participant1Id, UUID participant2Id) {
        this.participant1Id = participant1Id;
        this.participant2Id = participant2Id;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getParticipant1Id() { return participant1Id; }
    public UUID getParticipant2Id() { return participant2Id; }
    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setParticipant1Id(UUID participant1Id) { this.participant1Id = participant1Id; }
    public void setParticipant2Id(UUID participant2Id) { this.participant2Id = participant2Id; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
