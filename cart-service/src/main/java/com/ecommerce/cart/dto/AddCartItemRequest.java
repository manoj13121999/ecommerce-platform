package com.ecommerce.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record AddCartItemRequest(
        @NotNull Long productId,
        @NotBlank String productName,
        @NotNull @Min(0) BigDecimal price,
        String imageUrl,
        @Min(1) int quantity
) {
}
