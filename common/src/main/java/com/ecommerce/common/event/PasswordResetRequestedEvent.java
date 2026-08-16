package com.ecommerce.common.event;

import java.time.Instant;

public record PasswordResetRequestedEvent(
        String eventId,
        Long userId,
        String email,
        String resetToken,
        Instant occurredAt
) {
}
