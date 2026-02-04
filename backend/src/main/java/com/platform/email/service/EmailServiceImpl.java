package com.platform.email.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.enabled:false}")
    private boolean emailEnabled;

    @Value("${spring.mail.from:noreply@startupplatform.io}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void sendOfferReceivedEmail(String toEmail, String investorName, String startupName, String offerAmount) {
        String subject = "New Investment Offer for " + startupName;
        String content = EmailTemplates.offerReceivedEmail(investorName, startupName, offerAmount);
        sendHtmlEmail(toEmail, subject, content);
    }

    @Override
    @Async
    public void sendOfferAcceptedEmail(String toEmail, String startupName, String offerAmount) {
        String subject = "Your Investment Offer Has Been Accepted!";
        String content = EmailTemplates.offerAcceptedEmail(startupName, offerAmount);
        sendHtmlEmail(toEmail, subject, content);
    }

    @Override
    @Async
    public void sendOfferRejectedEmail(String toEmail, String startupName, String offerAmount) {
        String subject = "Update on Your Investment Offer";
        String content = EmailTemplates.offerRejectedEmail(startupName, offerAmount);
        sendHtmlEmail(toEmail, subject, content);
    }

    @Override
    @Async
    public void sendNewMessageEmail(String toEmail, String senderName) {
        String subject = "New Message from " + senderName;
        String content = EmailTemplates.newMessageEmail(senderName);
        sendHtmlEmail(toEmail, subject, content);
    }

    @Override
    @Async
    public void sendWelcomeEmail(String toEmail, String firstName) {
        String subject = "Welcome to Startup Investment Platform!";
        String content = EmailTemplates.welcomeEmail(firstName);
        sendHtmlEmail(toEmail, subject, content);
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (!emailEnabled) {
            logger.info("Email disabled. Would send to: {}, subject: {}", to, subject);
            logger.debug("Email content: {}", htmlContent);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
        }
    }
}
