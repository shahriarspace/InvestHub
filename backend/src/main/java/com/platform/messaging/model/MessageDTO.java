package com.platform.messaging.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
