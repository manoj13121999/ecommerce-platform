package com.ecommerce.common.event;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentCompletedEvent(
        String eventId,
        Long orderId,
        Long userId,
        String customerEmail,
        String paymentReference,
        BigDecimal amount,
        Instant occurredAt
) {
}
