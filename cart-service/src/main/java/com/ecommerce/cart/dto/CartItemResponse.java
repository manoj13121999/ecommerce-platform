package com.ecommerce.cart.dto;

import java.math.BigDecimal;

public record CartItemResponse(
        Long productId,
        String productName,
        BigDecimal price,
        String imageUrl,
        int quantity,
        BigDecimal lineTotal
) {
}
