package com.ecommerce.catalog.dto;

import java.util.List;

public record AdminProductPageResponse(
        List<AdminProductResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
