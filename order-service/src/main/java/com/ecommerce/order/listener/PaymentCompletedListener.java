package com.ecommerce.order.listener;

import com.ecommerce.common.event.KafkaTopics;
import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.order.service.OrderService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentCompletedListener {

    private final OrderService orderService;

    public PaymentCompletedListener(OrderService orderService) {
        this.orderService = orderService;
    }

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_COMPLETED,
            groupId = "order-service",
            containerFactory = "paymentCompletedKafkaListenerContainerFactory")
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        orderService.markOrderPaid(event);
    }
}
