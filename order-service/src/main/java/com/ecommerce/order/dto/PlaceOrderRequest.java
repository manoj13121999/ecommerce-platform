package com.ecommerce.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record PlaceOrderRequest(
        @NotBlank String shippingAddress,
        @NotEmpty @Valid List<PlaceOrderItemRequest> items
) {
    public record PlaceOrderItemRequest(
            @NotNull Long productId,
            @NotBlank String productName,
            @NotNull BigDecimal price,
            String imageUrl,
            @Min(1) int quantity
    ) {
    }
}
