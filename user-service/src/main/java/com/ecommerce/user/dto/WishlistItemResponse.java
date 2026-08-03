package com.ecommerce.user.dto;

import java.time.Instant;

public record WishlistItemResponse(
        Long productId,
        Instant addedAt
) {
}
