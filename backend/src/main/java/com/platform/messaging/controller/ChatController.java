package com.platform.messaging.controller;

import com.platform.messaging.model.Message;
import com.platform.messaging.model.MessageDTO;
import com.platform.messaging.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessagingService messagingService;

    /**
     * Handle sending messages to a specific conversation
     * Client sends to: /app/chat.send/{conversationId}
     * Message is persisted and broadcast to: /topic/conversation/{conversationId}
     */
    @MessageMapping("/chat.send/{conversationId}")
    public void sendMessage(@DestinationVariable String conversationId, @Payload MessageDTO messageDTO) {
        // Set the conversation ID from the path
        messageDTO.setConversationId(UUID.fromString(conversationId));
        
        // Save message to database
        Message savedMessage = messagingService.sendMessage(messageDTO);
        
        // Convert to DTO for response
        MessageDTO responseDTO = new MessageDTO();
        responseDTO.setId(savedMessage.getId());
        responseDTO.setConversationId(savedMessage.getConversationId());
        responseDTO.setSenderId(savedMessage.getSenderId());
        responseDTO.setContent(savedMessage.getContent());
        responseDTO.setIsRead(savedMessage.getIsRead());
        responseDTO.setCreatedAt(savedMessage.getCreatedAt());
        
        // Broadcast to all subscribers of this conversation
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, responseDTO);
    }

    /**
     * Handle generic message sending (for backward compatibility)
     * Client sends to: /app/chat.send
     * Message is broadcast to: /topic/messages
     */
    @MessageMapping("/chat.send")
    public void sendGenericMessage(@Payload MessageDTO messageDTO) {
        if (messageDTO.getConversationId() != null) {
            // Save to database
            Message savedMessage = messagingService.sendMessage(messageDTO);
            
            MessageDTO responseDTO = new MessageDTO();
            responseDTO.setId(savedMessage.getId());
            responseDTO.setConversationId(savedMessage.getConversationId());
            responseDTO.setSenderId(savedMessage.getSenderId());
            responseDTO.setContent(savedMessage.getContent());
            responseDTO.setIsRead(savedMessage.getIsRead());
            responseDTO.setCreatedAt(savedMessage.getCreatedAt());
            
            // Broadcast to conversation-specific topic
            messagingTemplate.convertAndSend("/topic/conversation/" + messageDTO.getConversationId(), responseDTO);
        }
        
        // Also broadcast to general topic
        messagingTemplate.convertAndSend("/topic/messages", messageDTO);
    }

    /**
     * Handle user joining a conversation
     * Client sends to: /app/chat.join/{conversationId}
     */
    @MessageMapping("/chat.join/{conversationId}")
    public void joinConversation(@DestinationVariable String conversationId, @Payload MessageDTO message) {
        message.setContent(message.getSenderId() + " joined the conversation");
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, message);
    }

    /**
     * Handle user leaving a conversation
     * Client sends to: /app/chat.leave/{conversationId}
     */
    @MessageMapping("/chat.leave/{conversationId}")
    public void leaveConversation(@DestinationVariable String conversationId, @Payload MessageDTO message) {
        message.setContent(message.getSenderId() + " left the conversation");
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, message);
    }

    /**
     * Handle typing indicator
     * Client sends to: /app/chat.typing/{conversationId}
     */
    @MessageMapping("/chat.typing/{conversationId}")
    public void userTyping(@DestinationVariable String conversationId, @Payload TypingIndicator indicator) {
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId + "/typing", indicator);
    }

    /**
     * Mark messages as read via WebSocket
     * Client sends to: /app/chat.read/{conversationId}
     */
    @MessageMapping("/chat.read/{conversationId}")
    public void markAsRead(@DestinationVariable String conversationId, @Payload ReadReceipt receipt) {
        messagingService.markConversationAsRead(UUID.fromString(conversationId));
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId + "/read", receipt);
    }

    // Inner class for typing indicator
    public static class TypingIndicator {
        private UUID userId;
        private boolean isTyping;

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        public boolean isTyping() { return isTyping; }
        public void setTyping(boolean typing) { isTyping = typing; }
    }

    // Inner class for read receipt
    public static class ReadReceipt {
        private UUID userId;
        private UUID conversationId;

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        public UUID getConversationId() { return conversationId; }
        public void setConversationId(UUID conversationId) { this.conversationId = conversationId; }
    }
}
