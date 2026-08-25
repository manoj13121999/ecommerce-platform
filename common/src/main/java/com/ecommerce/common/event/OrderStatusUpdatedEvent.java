package com.ecommerce.common.event;

import java.time.Instant;

public record OrderStatusUpdatedEvent(
        String eventId,
        Long orderId,
        Long userId,
        String customerEmail,
        String previousStatus,
        String newStatus,
        Instant occurredAt
) {
}
