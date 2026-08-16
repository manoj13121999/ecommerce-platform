package com.ecommerce.common.event;

import java.time.Instant;
import java.util.List;

public record OrderPaidEvent(
        String eventId,
        Long orderId,
        Long userId,
        List<OrderPaidItem> items,
        Instant occurredAt
) {
    public record OrderPaidItem(
            Long productId,
            int quantity
    ) {
    }
}
