package com.ecommerce.user.dto;

import jakarta.validation.constraints.NotNull;

public record AddWishlistRequest(
        @NotNull Long productId
) {
}
