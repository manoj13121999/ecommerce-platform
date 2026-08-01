package com.ecommerce.common.event;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderPlacedEvent(
        String eventId,
        Long orderId,
        Long userId,
        BigDecimal totalAmount,
        Instant occurredAt
) {
}
