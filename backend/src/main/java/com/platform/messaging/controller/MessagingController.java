package com.platform.messaging.controller;

import com.platform.messaging.model.Conversation;
import com.platform.messaging.model.Message;
import com.platform.messaging.model.MessageDTO;
import com.platform.messaging.service.MessagingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
public class MessagingController {
    
    @Autowired
    private MessagingService messagingService;
    
    /**
     * Get or create conversation between two users
     */
    @PostMapping("/conversations")
    public ResponseEntity<Conversation> getOrCreateConversation(
            @RequestParam UUID user1Id,
            @RequestParam UUID user2Id) {
        Conversation conversation = messagingService.getOrCreateConversation(user1Id, user2Id);
        return ResponseEntity.ok(conversation);
    }
    
    /**
     * Get conversation by ID
     */
    @GetMapping("/conversations/{id}")
    public ResponseEntity<?> getConversationById(@PathVariable UUID id) {
        var conversation = messagingService.getConversationById(id);
        if (conversation.isPresent()) {
            return ResponseEntity.ok(conversation.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Conversation not found");
    }
    
    /**
     * Get all conversations for a user
     */
    @GetMapping("/conversations/user/{userId}")
    public ResponseEntity<List<Conversation>> getConversationsByUserId(@PathVariable UUID userId) {
        List<Conversation> conversations = messagingService.getConversationsByUserId(userId);
        return ResponseEntity.ok(conversations);
    }
    
    /**
     * Send a message
     */
    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageDTO messageDTO) {
        if (messageDTO.getConversationId() == null || messageDTO.getSenderId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Conversation ID and Sender ID are required");
        }
        if (messageDTO.getContent() == null || messageDTO.getContent().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Message content is required");
        }
        Message sentMessage = messagingService.sendMessage(messageDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(sentMessage);
    }
    
    /**
     * Get messages in a conversation
     */
    @GetMapping("/{conversationId}")
    public ResponseEntity<Page<Message>> getConversationMessages(
            @PathVariable UUID conversationId,
            Pageable pageable) {
        return ResponseEntity.ok(messagingService.getMessagesByConversation(conversationId, pageable));
    }
    
    /**
     * Get unread messages in a conversation
     */
    @GetMapping("/{conversationId}/unread")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable UUID conversationId) {
        List<Message> unreadMessages = messagingService.getUnreadMessages(conversationId);
        return ResponseEntity.ok(unreadMessages);
    }
    
    /**
     * Mark message as read
     */
    @PutMapping("/{messageId}/read")
    public ResponseEntity<?> markMessageAsRead(@PathVariable UUID messageId) {
        Message message = messagingService.markMessageAsRead(messageId);
        if (message != null) {
            return ResponseEntity.ok(message);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Message not found");
    }
    
    /**
     * Mark all messages in conversation as read
     */
    @PutMapping("/{conversationId}/read-all")
    public ResponseEntity<?> markConversationAsRead(@PathVariable UUID conversationId) {
        messagingService.markConversationAsRead(conversationId);
        return ResponseEntity.ok("All messages marked as read");
    }
    
    /**
     * Delete message
     */
    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable UUID messageId) {
        if (messagingService.deleteMessage(messageId)) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Message not found");
    }
}
