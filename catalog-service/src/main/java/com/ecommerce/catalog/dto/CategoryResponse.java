package com.ecommerce.catalog.dto;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        long productCount
) {
}
