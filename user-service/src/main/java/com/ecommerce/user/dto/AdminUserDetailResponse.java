package com.ecommerce.user.dto;

import com.ecommerce.user.entity.Role;
import java.time.Instant;

public record AdminUserDetailResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phone,
        Role role,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt
) {
}
