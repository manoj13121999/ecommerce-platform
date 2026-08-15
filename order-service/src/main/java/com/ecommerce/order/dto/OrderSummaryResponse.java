package com.ecommerce.order.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderSummaryResponse(
        Long id,
        String status,
        BigDecimal subtotal,
        Instant createdAt,
        int itemCount
) {
}
