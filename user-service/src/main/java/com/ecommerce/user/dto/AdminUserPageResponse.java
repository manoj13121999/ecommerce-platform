package com.ecommerce.user.dto;

import java.util.List;

public record AdminUserPageResponse(
        List<AdminUserSummaryResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
