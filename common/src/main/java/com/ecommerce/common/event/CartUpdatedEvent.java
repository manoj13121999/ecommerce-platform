package com.ecommerce.common.event;

import java.time.Instant;

public record CartUpdatedEvent(
        String eventId,
        Long userId,
        int itemCount,
        Instant occurredAt
) {
}
