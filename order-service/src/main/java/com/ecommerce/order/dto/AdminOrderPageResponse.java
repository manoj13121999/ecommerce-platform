package com.ecommerce.order.dto;

import java.util.List;

public record AdminOrderPageResponse(
        List<AdminOrderSummaryResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
