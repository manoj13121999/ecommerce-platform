package com.ecommerce.catalog.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ValidateItemsRequest(
        @NotEmpty @Valid List<ValidateItemRequest> items
) {
    public record ValidateItemRequest(
            @NotNull Long productId,
            @Min(1) int quantity
    ) {
    }
}
