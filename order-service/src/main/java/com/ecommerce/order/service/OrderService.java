package com.ecommerce.order.service;

import com.ecommerce.common.event.KafkaTopics;
import com.ecommerce.common.event.OrderPaidEvent;
import com.ecommerce.common.event.OrderPlacedEvent;
import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.order.dto.OrderItemResponse;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.dto.OrderSummaryResponse;
import com.ecommerce.order.dto.PlaceOrderRequest;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.repository.OrderRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderService(OrderRepository orderRepository, KafkaTemplate<String, Object> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public OrderResponse placeOrder(Long userId, PlaceOrderRequest request) {
        Order order = new Order();
        order.setUserId(userId);
        order.setStatus("PLACED");
        order.setShippingAddress(request.shippingAddress().trim());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (PlaceOrderRequest.PlaceOrderItemRequest itemRequest : request.items()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemRequest.productId());
            item.setProductName(itemRequest.productName());
            item.setPrice(itemRequest.price());
            item.setImageUrl(itemRequest.imageUrl());
            item.setQuantity(itemRequest.quantity());
            order.addItem(item);
            subtotal = subtotal.add(itemRequest.price().multiply(BigDecimal.valueOf(itemRequest.quantity())));
        }

        order.setSubtotal(subtotal);
        Order saved = orderRepository.save(order);

        kafkaTemplate.send(
                KafkaTopics.ORDER_PLACED,
                saved.getId().toString(),
                new OrderPlacedEvent(
                        UUID.randomUUID().toString(),
                        saved.getId(),
                        userId,
                        saved.getSubtotal(),
                        Instant.now()));

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> listOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(order -> new OrderSummaryResponse(
                        order.getId(),
                        order.getStatus(),
                        order.getSubtotal(),
                        order.getCreatedAt(),
                        order.getItems().stream().mapToInt(OrderItem::getQuantity).sum()))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(Long userId, Long orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        return toResponse(order);
    }

    @Transactional
    public void markOrderPaid(PaymentCompletedEvent event) {
        Order order = orderRepository.findById(event.orderId()).orElse(null);
        if (order == null || !order.getUserId().equals(event.userId())) {
            return;
        }
        if ("PAID".equals(order.getStatus())) {
            return;
        }

        order.setStatus("PAID");
        orderRepository.save(order);

        List<OrderPaidEvent.OrderPaidItem> items = order.getItems().stream()
                .map(item -> new OrderPaidEvent.OrderPaidItem(item.getProductId(), item.getQuantity()))
                .toList();

        kafkaTemplate.send(
                KafkaTopics.ORDER_PAID,
                order.getId().toString(),
                new OrderPaidEvent(
                        UUID.randomUUID().toString(),
                        order.getId(),
                        order.getUserId(),
                        items,
                        Instant.now()));
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
}
