package com.ecommerce.catalog.dto;

import java.math.BigDecimal;
import java.util.List;

public record ValidateItemsResponse(
        boolean valid,
        String message,
        List<ValidatedItem> items
) {
    public record ValidatedItem(
            Long productId,
            String productName,
            BigDecimal price,
            String imageUrl,
            int quantity,
            int availableStock,
            boolean valid,
            String message
    ) {
    }
}
