package com.ecommerce.order.service;

import com.ecommerce.common.event.KafkaTopics;
import com.ecommerce.common.event.OrderStatusUpdatedEvent;
import com.ecommerce.order.dto.AdminOrderPageResponse;
import com.ecommerce.order.dto.AdminOrderStatsResponse;
import com.ecommerce.order.dto.AdminOrderSummaryResponse;
import com.ecommerce.order.dto.OrderItemResponse;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.dto.UpdateOrderStatusRequest;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderAdminService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED");
    private static final Set<String> NOTIFY_STATUSES = Set.of("SHIPPED", "DELIVERED", "CANCELLED");

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderAdminService(
            OrderRepository orderRepository,
            KafkaTemplate<String, Object> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional(readOnly = true)
    public AdminOrderPageResponse listOrders(String status, int page, int size) {
        String normalizedStatus = normalizeStatusFilter(status);
        PageRequest pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findForAdmin(normalizedStatus, pageable);
        List<AdminOrderSummaryResponse> content = orders.getContent().stream()
                .map(this::toSummary)
                .toList();
        return new AdminOrderPageResponse(
                content,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public AdminOrderStatsResponse getStats() {
        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (String status : ALLOWED_STATUSES) {
            ordersByStatus.put(status, 0L);
        }

        for (Object[] row : orderRepository.countGroupedByStatus()) {
            ordersByStatus.put((String) row[0], (Long) row[1]);
        }

        BigDecimal revenue = orderRepository.sumSubtotalByStatusIn(
                List.of("PAID", "SHIPPED", "DELIVERED"));
        if (revenue == null) {
            revenue = BigDecimal.ZERO;
        }

        return new AdminOrderStatsResponse(orderRepository.count(), ordersByStatus, revenue);
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, UpdateOrderStatusRequest request) {
        String status = request.status().trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        String previousStatus = order.getStatus();
        if (previousStatus.equals(status)) {
            return toResponse(order);
        }

        order.setStatus(status);
        Order saved = orderRepository.save(order);

        if (NOTIFY_STATUSES.contains(status)) {
            kafkaTemplate.send(
                    KafkaTopics.ORDER_STATUS_UPDATED,
                    saved.getId().toString(),
                    new OrderStatusUpdatedEvent(
                            UUID.randomUUID().toString(),
                            saved.getId(),
                            saved.getUserId(),
                            request.customerEmail(),
                            previousStatus,
                            status,
                            Instant.now()));
        }

        return toResponse(saved);
    }

    private AdminOrderSummaryResponse toSummary(Order order) {
        return new AdminOrderSummaryResponse(
                order.getId(),
                order.getUserId(),
                order.getStatus(),
                order.getSubtotal(),
                order.getCreatedAt(),
                order.getItems().stream().mapToInt(OrderItem::getQuantity).sum());
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProductId(),
                        item.getProductName(),
                        item.getPrice(),
                        item.getImageUrl(),
                        item.getQuantity(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getStatus(),
                order.getSubtotal(),
                order.getShippingAddress(),
                order.getCreatedAt(),
                items);
    }

    private String normalizeStatusFilter(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATUSES.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status filter");
        }
        return normalized;
    }
}
