package com.platform.messaging.service;

import com.platform.messaging.model.Conversation;
import com.platform.messaging.model.Message;
import com.platform.messaging.model.MessageDTO;
import com.platform.messaging.repository.ConversationRepository;
import com.platform.messaging.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MessagingService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    /**
     * Get or create a conversation between two users
     */
    public Conversation getOrCreateConversation(UUID user1Id, UUID user2Id) {
        Optional<Conversation> conversation = conversationRepository.findByParticipants(user1Id, user2Id);
        if (conversation.isPresent()) {
            return conversation.get();
        }
        
        // Create new conversation if it doesn't exist
        Conversation newConversation = new Conversation(user1Id, user2Id);
        return conversationRepository.save(newConversation);
    }
    
    /**
     * Get conversation by ID
     */
    public Optional<Conversation> getConversationById(UUID id) {
        return conversationRepository.findById(id);
    }
    
    /**
     * Get all conversations for a user
     */
    public List<Conversation> getConversationsByUserId(UUID userId) {
        return conversationRepository.findByUserId(userId);
    }
    
    /**
     * Send a message
     */
    public Message sendMessage(MessageDTO messageDTO) {
        Message message = new Message();
        message.setConversationId(messageDTO.getConversationId());
        message.setSenderId(messageDTO.getSenderId());
        message.setContent(messageDTO.getContent());
        message.setIsRead(false);
        
        Message savedMessage = messageRepository.save(message);
        
        // Update conversation's lastMessageAt
        Optional<Conversation> conversation = conversationRepository.findById(messageDTO.getConversationId());
        if (conversation.isPresent()) {
            Conversation c = conversation.get();
            c.setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(c);
        }
        
        return savedMessage;
    }
    
    /**
     * Get messages in a conversation
     */
    public Page<Message> getMessagesByConversation(UUID conversationId, Pageable pageable) {
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
    }
    
    /**
     * Get unread messages in a conversation
     */
    public List<Message> getUnreadMessages(UUID conversationId) {
        return messageRepository.findByConversationIdAndIsReadFalse(conversationId);
    }
    
    /**
     * Mark message as read
     */
    public Message markMessageAsRead(UUID messageId) {
        Optional<Message> message = messageRepository.findById(messageId);
        if (message.isPresent()) {
            Message m = message.get();
            m.setIsRead(true);
            return messageRepository.save(m);
        }
        return null;
    }
    
    /**
     * Mark all messages in conversation as read
     */
    public void markConversationAsRead(UUID conversationId) {
        List<Message> unreadMessages = messageRepository.findByConversationIdAndIsReadFalse(conversationId);
        for (Message message : unreadMessages) {
            message.setIsRead(true);
            messageRepository.save(message);
        }
    }
    
    /**
     * Get message by ID
     */
    public Optional<Message> getMessageById(UUID id) {
        return messageRepository.findById(id);
    }
    
    /**
     * Delete message
     */
    public boolean deleteMessage(UUID id) {
        if (messageRepository.existsById(id)) {
            messageRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
