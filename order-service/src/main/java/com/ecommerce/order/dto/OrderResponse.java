package com.ecommerce.order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        Long userId,
        String status,
        BigDecimal subtotal,
        String shippingAddress,
        Instant createdAt,
        List<OrderItemResponse> items
) {
}
