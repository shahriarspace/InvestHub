package com.platform.messaging.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class MessageDTO {
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;

    // Constructors
    public MessageDTO() {}

    public MessageDTO(UUID conversationId, UUID senderId, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.isRead = false;
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getConversationId() { return conversationId; }
    public UUID getSenderId() { return senderId; }
    public String getContent() { return content; }
    public Boolean getIsRead() { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }
    public void setContent(String content) { this.content = content; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
