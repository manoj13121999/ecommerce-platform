package com.ecommerce.order.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        BigDecimal price,
        String imageUrl,
        int quantity,
        BigDecimal lineTotal
) {
}
