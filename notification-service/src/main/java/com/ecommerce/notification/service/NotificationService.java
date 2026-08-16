package com.ecommerce.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final String frontendBaseUrl;

    public NotificationService(@Value("${app.frontend-base-url}") String frontendBaseUrl) {
        this.frontendBaseUrl = frontendBaseUrl.replaceAll("/$", "");
    }

    public void sendWelcomeEmail(String email, String firstName) {
        log.info("[EMAIL] Welcome to ShopVault, {}! Sent to {}", firstName, email);
    }

    public void sendPasswordResetEmail(String email, String resetToken) {
        String resetUrl = frontendBaseUrl + "/reset-password?token=" + resetToken;
        log.info("[EMAIL] Password reset link for {}: {}", email, resetUrl);
    }

    public void sendOrderConfirmationEmail(String email, Long orderId, String paymentReference) {
        log.info(
                "[EMAIL] Order #{} confirmed for {}. Payment ref: {}. View: {}/orders/{}",
                orderId,
                email,
                paymentReference,
                frontendBaseUrl,
                orderId);
    }
}
