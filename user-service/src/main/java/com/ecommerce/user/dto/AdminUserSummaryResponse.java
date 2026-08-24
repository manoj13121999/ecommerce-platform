package com.ecommerce.user.dto;

import com.ecommerce.user.entity.Role;
import java.time.Instant;

public record AdminUserSummaryResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        Role role,
        boolean enabled,
        Instant createdAt
) {
}
