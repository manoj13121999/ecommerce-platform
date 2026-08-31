package com.ecommerce.common.event;

import java.time.Instant;
import java.util.List;

public record OrderStatusUpdatedEvent(
        String eventId,
        Long orderId,
        Long userId,
        String customerEmail,
        String previousStatus,
        String newStatus,
        Instant occurredAt,
        List<StatusLineItem> items
) {
    public record StatusLineItem(Long productId, int quantity) {
    }
}
