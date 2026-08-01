package com.ecommerce.user.dto;

import com.ecommerce.user.entity.Role;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phone,
        Role role
) {
}
