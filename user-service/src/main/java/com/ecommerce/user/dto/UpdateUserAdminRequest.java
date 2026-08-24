package com.ecommerce.user.dto;

import com.ecommerce.user.entity.Role;
import jakarta.validation.constraints.NotNull;

public record UpdateUserAdminRequest(
        @NotNull Role role,
        @NotNull Boolean enabled
) {
}
