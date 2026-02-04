package com.platform.email.service;

public interface EmailService {
    void sendOfferReceivedEmail(String toEmail, String investorName, String startupName, String offerAmount);
    void sendOfferAcceptedEmail(String toEmail, String startupName, String offerAmount);
    void sendOfferRejectedEmail(String toEmail, String startupName, String offerAmount);
    void sendNewMessageEmail(String toEmail, String senderName);
    void sendWelcomeEmail(String toEmail, String firstName);
}
