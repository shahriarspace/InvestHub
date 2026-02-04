package com.platform.notification.service;

import com.platform.notification.model.Notification;
import com.platform.notification.model.NotificationDTO;
import com.platform.notification.model.NotificationType;
import com.platform.notification.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@SpringBootTest
@ActiveProfiles("test")
class NotificationServiceTest {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;

    @MockBean
    private SimpMessagingTemplate messagingTemplate;

    private UUID testUserId;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        testUserId = UUID.randomUUID();
    }

    @Test
    void createNotification_ShouldCreateAndReturnNotification() {
        Notification notification = notificationService.createNotification(
            testUserId,
            NotificationType.OFFER_RECEIVED,
            "New Offer",
            "You received a new investment offer",
            UUID.randomUUID()
        );

        assertNotNull(notification);
        assertNotNull(notification.getId());
        assertEquals(testUserId, notification.getUserId());
        assertEquals(NotificationType.OFFER_RECEIVED, notification.getType());
        assertEquals("New Offer", notification.getTitle());
        assertFalse(notification.isRead());
    }

    @Test
    void createNotification_ShouldSendWebSocketMessage() {
        notificationService.createNotification(
            testUserId,
            NotificationType.MESSAGE_RECEIVED,
            "New Message",
            "You have a new message",
            UUID.randomUUID()
        );

        verify(messagingTemplate).convertAndSendToUser(
            eq(testUserId.toString()),
            eq("/queue/notifications"),
            any(NotificationDTO.class)
        );
    }

    @Test
    void getNotificationsByUserId_ShouldReturnUserNotifications() {
        // Create multiple notifications
        notificationService.createNotification(testUserId, NotificationType.OFFER_RECEIVED, "Offer 1", "Message 1", null);
        notificationService.createNotification(testUserId, NotificationType.OFFER_ACCEPTED, "Offer 2", "Message 2", null);
        notificationService.createNotification(UUID.randomUUID(), NotificationType.SYSTEM, "Other", "Other user", null);

        List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(testUserId);

        assertEquals(2, notifications.size());
    }

    @Test
    void getUnreadCount_ShouldReturnCorrectCount() {
        notificationService.createNotification(testUserId, NotificationType.OFFER_RECEIVED, "Title 1", "Message 1", null);
        notificationService.createNotification(testUserId, NotificationType.OFFER_ACCEPTED, "Title 2", "Message 2", null);
        notificationService.createNotification(testUserId, NotificationType.MESSAGE_RECEIVED, "Title 3", "Message 3", null);

        long count = notificationService.getUnreadCount(testUserId);

        assertEquals(3, count);
    }

    @Test
    void markAsRead_ShouldMarkNotificationAsRead() {
        Notification notification = notificationService.createNotification(
            testUserId,
            NotificationType.OFFER_RECEIVED,
            "Title",
            "Message",
            null
        );

        boolean result = notificationService.markAsRead(notification.getId());

        assertTrue(result);
        assertEquals(0, notificationService.getUnreadCount(testUserId));
    }

    @Test
    void markAllAsRead_ShouldMarkAllUserNotificationsAsRead() {
        notificationService.createNotification(testUserId, NotificationType.OFFER_RECEIVED, "Title 1", "Message 1", null);
        notificationService.createNotification(testUserId, NotificationType.OFFER_ACCEPTED, "Title 2", "Message 2", null);
        notificationService.createNotification(testUserId, NotificationType.MESSAGE_RECEIVED, "Title 3", "Message 3", null);

        assertEquals(3, notificationService.getUnreadCount(testUserId));

        int markedCount = notificationService.markAllAsRead(testUserId);

        assertEquals(3, markedCount);
        assertEquals(0, notificationService.getUnreadCount(testUserId));
    }

    @Test
    void notifyOfferReceived_ShouldCreateCorrectNotification() {
        UUID offerId = UUID.randomUUID();
        notificationService.notifyOfferReceived(testUserId, "John Investor", "My Startup", offerId);

        List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(testUserId);

        assertEquals(1, notifications.size());
        assertEquals(NotificationType.OFFER_RECEIVED, notifications.get(0).getType());
        assertEquals("New Investment Offer", notifications.get(0).getTitle());
        assertTrue(notifications.get(0).getMessage().contains("John Investor"));
        assertTrue(notifications.get(0).getMessage().contains("My Startup"));
    }

    @Test
    void notifyOfferAccepted_ShouldCreateCorrectNotification() {
        UUID offerId = UUID.randomUUID();
        notificationService.notifyOfferAccepted(testUserId, "TechVenture AI", offerId);

        List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(testUserId);

        assertEquals(1, notifications.size());
        assertEquals(NotificationType.OFFER_ACCEPTED, notifications.get(0).getType());
        assertTrue(notifications.get(0).getMessage().contains("accepted"));
    }
}
