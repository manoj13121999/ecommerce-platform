package com.ecommerce.catalog.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpdateProductRequest(
        @NotNull Long categoryId,
        @NotBlank String name,
        String slug,
        @NotBlank String description,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        BigDecimal compareAtPrice,
        @Min(0) int stock,
        String imageUrl,
        @NotNull Boolean active
) {
}
