package com.platform.messaging.service;

import com.platform.messaging.model.Conversation;
import com.platform.messaging.model.Message;
import com.platform.messaging.model.MessageDTO;
import com.platform.messaging.repository.ConversationRepository;
import com.platform.messaging.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class MessagingServiceTest {

    @Autowired
    private MessagingService messagingService;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private MessageRepository messageRepository;

    private UUID user1Id;
    private UUID user2Id;
    private Conversation testConversation;

    @BeforeEach
    void setUp() {
        messageRepository.deleteAll();
        conversationRepository.deleteAll();

        user1Id = UUID.randomUUID();
        user2Id = UUID.randomUUID();

        testConversation = new Conversation(user1Id, user2Id);
        testConversation = conversationRepository.save(testConversation);
    }

    @Test
    void getOrCreateConversation_WithExistingConversation_ReturnsExisting() {
        Conversation result = messagingService.getOrCreateConversation(user1Id, user2Id);

        assertNotNull(result);
        assertEquals(testConversation.getId(), result.getId());
    }

    @Test
    void getOrCreateConversation_WithReversedUserIds_ReturnsExisting() {
        // Should return the same conversation regardless of order
        Conversation result = messagingService.getOrCreateConversation(user2Id, user1Id);

        assertNotNull(result);
        assertEquals(testConversation.getId(), result.getId());
    }

    @Test
    void getOrCreateConversation_WithNewUsers_CreatesNew() {
        UUID newUser1 = UUID.randomUUID();
        UUID newUser2 = UUID.randomUUID();

        Conversation result = messagingService.getOrCreateConversation(newUser1, newUser2);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertNotEquals(testConversation.getId(), result.getId());
    }

    @Test
    void getConversationById_WithExistingId_ReturnsConversation() {
        Optional<Conversation> result = messagingService.getConversationById(testConversation.getId());

        assertTrue(result.isPresent());
        assertEquals(testConversation.getId(), result.get().getId());
    }

    @Test
    void getConversationById_WithNonExistingId_ReturnsEmpty() {
        Optional<Conversation> result = messagingService.getConversationById(UUID.randomUUID());

        assertFalse(result.isPresent());
    }

    @Test
    void getConversationsByUserId_WithExistingUserId_ReturnsConversations() {
        // Create another conversation for user1
        UUID user3Id = UUID.randomUUID();
        Conversation anotherConversation = new Conversation(user1Id, user3Id);
        conversationRepository.save(anotherConversation);

        List<Conversation> result = messagingService.getConversationsByUserId(user1Id);

        assertEquals(2, result.size());
    }

    @Test
    void getConversationsByUserId_WithNonExistingUserId_ReturnsEmptyList() {
        List<Conversation> result = messagingService.getConversationsByUserId(UUID.randomUUID());

        assertTrue(result.isEmpty());
    }

    @Test
    void sendMessage_WithValidData_CreatesAndReturnsMessage() {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setConversationId(testConversation.getId());
        messageDTO.setSenderId(user1Id);
        messageDTO.setContent("Hello, this is a test message!");

        Message result = messagingService.sendMessage(messageDTO);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("Hello, this is a test message!", result.getContent());
        assertEquals(user1Id, result.getSenderId());
        assertEquals(testConversation.getId(), result.getConversationId());
        assertFalse(result.getIsRead());
    }

    @Test
    void sendMessage_UpdatesConversationLastMessageAt() {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setConversationId(testConversation.getId());
        messageDTO.setSenderId(user1Id);
        messageDTO.setContent("Test message");

        messagingService.sendMessage(messageDTO);

        Conversation updatedConversation = conversationRepository.findById(testConversation.getId()).orElseThrow();
        assertNotNull(updatedConversation.getLastMessageAt());
    }

    @Test
    void getMessagesByConversation_ReturnsMessagesWithPagination() {
        // Create multiple messages
        for (int i = 0; i < 5; i++) {
            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setConversationId(testConversation.getId());
            messageDTO.setSenderId(i % 2 == 0 ? user1Id : user2Id);
            messageDTO.setContent("Message " + i);
            messagingService.sendMessage(messageDTO);
        }

        Page<Message> result = messagingService.getMessagesByConversation(
                testConversation.getId(), 
                PageRequest.of(0, 3)
        );

        assertEquals(5, result.getTotalElements());
        assertEquals(3, result.getContent().size());
        assertEquals(2, result.getTotalPages());
    }

    @Test
    void getUnreadMessages_ReturnsOnlyUnreadMessages() {
        // Create mix of read and unread messages
        MessageDTO msg1 = new MessageDTO();
        msg1.setConversationId(testConversation.getId());
        msg1.setSenderId(user1Id);
        msg1.setContent("Unread message 1");
        Message message1 = messagingService.sendMessage(msg1);

        MessageDTO msg2 = new MessageDTO();
        msg2.setConversationId(testConversation.getId());
        msg2.setSenderId(user2Id);
        msg2.setContent("Unread message 2");
        messagingService.sendMessage(msg2);

        // Mark first message as read
        messagingService.markMessageAsRead(message1.getId());

        List<Message> unreadMessages = messagingService.getUnreadMessages(testConversation.getId());

        assertEquals(1, unreadMessages.size());
        assertEquals("Unread message 2", unreadMessages.get(0).getContent());
    }

    @Test
    void markMessageAsRead_WithExistingMessage_MarksAsRead() {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setConversationId(testConversation.getId());
        messageDTO.setSenderId(user1Id);
        messageDTO.setContent("Test message");
        Message message = messagingService.sendMessage(messageDTO);

        assertFalse(message.getIsRead());

        Message result = messagingService.markMessageAsRead(message.getId());

        assertNotNull(result);
        assertTrue(result.getIsRead());
    }

    @Test
    void markMessageAsRead_WithNonExistingMessage_ReturnsNull() {
        Message result = messagingService.markMessageAsRead(UUID.randomUUID());

        assertNull(result);
    }

    @Test
    void markConversationAsRead_MarksAllMessagesAsRead() {
        // Create multiple unread messages
        for (int i = 0; i < 3; i++) {
            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setConversationId(testConversation.getId());
            messageDTO.setSenderId(user1Id);
            messageDTO.setContent("Message " + i);
            messagingService.sendMessage(messageDTO);
        }

        // Verify all messages are unread
        List<Message> unreadBefore = messagingService.getUnreadMessages(testConversation.getId());
        assertEquals(3, unreadBefore.size());

        // Mark all as read
        messagingService.markConversationAsRead(testConversation.getId());

        // Verify all messages are now read
        List<Message> unreadAfter = messagingService.getUnreadMessages(testConversation.getId());
        assertTrue(unreadAfter.isEmpty());
    }

    @Test
    void getMessageById_WithExistingId_ReturnsMessage() {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setConversationId(testConversation.getId());
        messageDTO.setSenderId(user1Id);
        messageDTO.setContent("Test message");
        Message message = messagingService.sendMessage(messageDTO);

        Optional<Message> result = messagingService.getMessageById(message.getId());

        assertTrue(result.isPresent());
        assertEquals("Test message", result.get().getContent());
    }

    @Test
    void getMessageById_WithNonExistingId_ReturnsEmpty() {
        Optional<Message> result = messagingService.getMessageById(UUID.randomUUID());

        assertFalse(result.isPresent());
    }

    @Test
    void deleteMessage_WithExistingId_DeletesMessage() {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setConversationId(testConversation.getId());
        messageDTO.setSenderId(user1Id);
        messageDTO.setContent("Message to delete");
        Message message = messagingService.sendMessage(messageDTO);

        boolean result = messagingService.deleteMessage(message.getId());

        assertTrue(result);
        assertFalse(messageRepository.existsById(message.getId()));
    }

    @Test
    void deleteMessage_WithNonExistingId_ReturnsFalse() {
        boolean result = messagingService.deleteMessage(UUID.randomUUID());

        assertFalse(result);
    }

    @Test
    void sendMessage_SetsCreatedAt() {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setConversationId(testConversation.getId());
        messageDTO.setSenderId(user1Id);
        messageDTO.setContent("Test message");

        Message result = messagingService.sendMessage(messageDTO);

        assertNotNull(result.getCreatedAt());
    }
}
