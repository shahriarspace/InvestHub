package com.platform.notification.service;

import com.platform.notification.model.Notification;
import com.platform.notification.model.NotificationDTO;
import com.platform.notification.model.NotificationType;
import com.platform.notification.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository,
                               SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Notification createNotification(UUID userId, NotificationType type, String title, String message, UUID referenceId) {
        Notification notification = new Notification(userId, type, title, message, referenceId);
        notification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        sendWebSocketNotification(notification);
        
        return notification;
    }

    public void sendWebSocketNotification(Notification notification) {
        NotificationDTO dto = new NotificationDTO(notification);
        messagingTemplate.convertAndSendToUser(
            notification.getUserId().toString(),
            "/queue/notifications",
            dto
        );
    }

    public List<NotificationDTO> getNotificationsByUserId(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(NotificationDTO::new)
            .collect(Collectors.toList());
    }

    public Page<NotificationDTO> getNotificationsByUserId(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
            .map(NotificationDTO::new);
    }

    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
            .stream()
            .map(NotificationDTO::new)
            .collect(Collectors.toList());
    }

    public long getUnreadCount(UUID userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Transactional
    public boolean markAsRead(UUID notificationId) {
        Optional<Notification> optNotification = notificationRepository.findById(notificationId);
        if (optNotification.isPresent()) {
            Notification notification = optNotification.get();
            notification.setRead(true);
            notificationRepository.save(notification);
            return true;
        }
        return false;
    }

    @Transactional
    public int markAllAsRead(UUID userId) {
        return notificationRepository.markAllAsReadByUserId(userId);
    }

    // Convenience methods for creating specific notification types
    public void notifyOfferReceived(UUID startupOwnerId, String investorName, String startupName, UUID offerId) {
        createNotification(
            startupOwnerId,
            NotificationType.OFFER_RECEIVED,
            "New Investment Offer",
            investorName + " has made an investment offer for " + startupName,
            offerId
        );
    }

    public void notifyOfferAccepted(UUID investorUserId, String startupName, UUID offerId) {
        createNotification(
            investorUserId,
            NotificationType.OFFER_ACCEPTED,
            "Offer Accepted",
            "Your investment offer for " + startupName + " has been accepted!",
            offerId
        );
    }

    public void notifyOfferRejected(UUID investorUserId, String startupName, UUID offerId) {
        createNotification(
            investorUserId,
            NotificationType.OFFER_REJECTED,
            "Offer Rejected",
            "Your investment offer for " + startupName + " has been rejected.",
            offerId
        );
    }

    public void notifyNewMessage(UUID recipientId, String senderName, UUID conversationId) {
        createNotification(
            recipientId,
            NotificationType.MESSAGE_RECEIVED,
            "New Message",
            "You have a new message from " + senderName,
            conversationId
        );
    }
}
