package com.ecommerce.order.dto;

import java.math.BigDecimal;
import java.util.Map;

public record AdminOrderStatsResponse(
        long totalOrders,
        Map<String, Long> ordersByStatus,
        BigDecimal totalRevenue
) {
}
