package com.ecommerce.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
        Long userId,
        List<CartItemResponse> items,
        int itemCount,
        BigDecimal subtotal
) {
}
