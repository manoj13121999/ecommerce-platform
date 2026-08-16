package com.ecommerce.payment.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(
        Long id,
        Long orderId,
        String paymentMethod,
        String paymentReference,
        String status,
        BigDecimal amount,
        Instant createdAt
) {
}
