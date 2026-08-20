package com.ecommerce.catalog.dto;

import java.math.BigDecimal;

public record AdminProductResponse(
        Long id,
        String name,
        String slug,
        String description,
        BigDecimal price,
        BigDecimal compareAtPrice,
        int stock,
        String imageUrl,
        Long categoryId,
        String categoryName,
        boolean active
) {
}
