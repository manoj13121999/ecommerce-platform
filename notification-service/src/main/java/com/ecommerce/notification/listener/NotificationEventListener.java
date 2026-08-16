package com.ecommerce.notification.listener;

import com.ecommerce.common.event.KafkaTopics;
import com.ecommerce.common.event.PasswordResetRequestedEvent;
import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.common.event.UserRegisteredEvent;
import com.ecommerce.notification.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(
            topics = KafkaTopics.USER_REGISTERED,
            groupId = "notification-service",
            containerFactory = "userRegisteredKafkaListenerContainerFactory")
    public void onUserRegistered(UserRegisteredEvent event) {
        notificationService.sendWelcomeEmail(event.email(), event.firstName());
    }

    @KafkaListener(
            topics = KafkaTopics.PASSWORD_RESET_REQUESTED,
            groupId = "notification-service",
            containerFactory = "passwordResetKafkaListenerContainerFactory")
    public void onPasswordResetRequested(PasswordResetRequestedEvent event) {
        notificationService.sendPasswordResetEmail(event.email(), event.resetToken());
    }

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_COMPLETED,
            groupId = "notification-service",
            containerFactory = "paymentCompletedKafkaListenerContainerFactory")
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        notificationService.sendOrderConfirmationEmail(
                event.customerEmail(),
                event.orderId(),
                event.paymentReference());
    }
}
