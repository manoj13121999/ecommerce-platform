package com.ecommerce.order.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminOrderSummaryResponse(
        Long id,
        Long userId,
        String status,
        BigDecimal subtotal,
        Instant createdAt,
        int itemCount
) {
}
