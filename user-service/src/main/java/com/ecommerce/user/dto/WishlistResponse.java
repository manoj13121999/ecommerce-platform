package com.ecommerce.user.dto;

import java.util.List;

public record WishlistResponse(
        List<WishlistItemResponse> items,
        int count
) {
}
