package com.ecommerce.common.event;

import java.time.Instant;

public record UserRegisteredEvent(
        String eventId,
        Long userId,
        String email,
        String firstName,
        Instant occurredAt
) {
}
