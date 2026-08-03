package com.ecommerce.cart.service;

import com.ecommerce.cart.document.Cart;
import com.ecommerce.cart.document.CartItem;
import com.ecommerce.cart.dto.AddCartItemRequest;
import com.ecommerce.cart.dto.CartItemResponse;
import com.ecommerce.cart.dto.CartResponse;
import com.ecommerce.cart.dto.UpdateCartItemRequest;
import com.ecommerce.cart.repository.CartRepository;
import com.ecommerce.common.event.CartUpdatedEvent;
import com.ecommerce.common.event.KafkaTopics;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final long cacheTtlSeconds;

    public CartService(
            CartRepository cartRepository,
            RedisTemplate<String, String> redisTemplate,
            ObjectMapper objectMapper,
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${app.cart.cache-ttl-seconds}") long cacheTtlSeconds) {
        this.cartRepository = cartRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.kafkaTemplate = kafkaTemplate;
        this.cacheTtlSeconds = cacheTtlSeconds;
    }

    public CartResponse getCart(Long userId) {
        CartResponse cached = readFromCache(userId);
        if (cached != null) {
            return cached;
        }

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> createEmptyCart(userId));
        CartResponse response = toResponse(cart);
        writeToCache(userId, response);
        return response;
    }

    public CartResponse addItem(Long userId, AddCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> createEmptyCart(userId));

        CartItem existing = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.productId()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.quantity());
            existing.setProductName(request.productName());
            existing.setPrice(request.price());
            existing.setImageUrl(request.imageUrl());
        } else {
            cart.getItems().add(new CartItem(
                    request.productId(),
                    request.productName(),
                    request.price(),
                    request.imageUrl(),
                    request.quantity()));
        }

        cart.setUpdatedAt(Instant.now());
        Cart saved = cartRepository.save(cart);
        CartResponse response = toResponse(saved);
        writeToCache(userId, response);
        publishCartUpdated(userId, response.itemCount());
        return response;
    }

    public CartResponse updateItem(Long userId, Long productId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(cartItem -> cartItem.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart"));

        item.setQuantity(request.quantity());
        cart.setUpdatedAt(Instant.now());
        Cart saved = cartRepository.save(cart);
        CartResponse response = toResponse(saved);
        writeToCache(userId, response);
        publishCartUpdated(userId, response.itemCount());
        return response;
    }

    public CartResponse removeItem(Long userId, Long productId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        boolean removed = cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in cart");
        }

        cart.setUpdatedAt(Instant.now());
        Cart saved = cartRepository.save(cart);
        CartResponse response = toResponse(saved);
        writeToCache(userId, response);
        publishCartUpdated(userId, response.itemCount());
        return response;
    }

    public CartResponse clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> createEmptyCart(userId));
        cart.setItems(new ArrayList<>());
        cart.setUpdatedAt(Instant.now());
        Cart saved = cartRepository.save(cart);
        CartResponse response = toResponse(saved);
        writeToCache(userId, response);
        publishCartUpdated(userId, response.itemCount());
        return response;
    }

    private Cart createEmptyCart(Long userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setItems(new ArrayList<>());
        cart.setUpdatedAt(Instant.now());
        return cartRepository.save(cart);
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getProductId(),
                        item.getProductName(),
                        item.getPrice(),
                        item.getImageUrl(),
                        item.getQuantity(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))))
                .toList();

        int itemCount = items.stream().mapToInt(CartItemResponse::quantity).sum();
        BigDecimal subtotal = items.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(cart.getUserId(), items, itemCount, subtotal);
    }

    private String cacheKey(Long userId) {
        return "cart:" + userId;
    }

    private CartResponse readFromCache(Long userId) {
        String json = redisTemplate.opsForValue().get(cacheKey(userId));
        if (json == null) {
            return null;
        }
        try {
            return objectMapper.readValue(json, CartResponse.class);
        } catch (JsonProcessingException ex) {
            redisTemplate.delete(cacheKey(userId));
            return null;
        }
    }

    private void writeToCache(Long userId, CartResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey(userId),
                    objectMapper.writeValueAsString(response),
                    cacheTtlSeconds,
                    TimeUnit.SECONDS);
        } catch (JsonProcessingException ignored) {
            redisTemplate.delete(cacheKey(userId));
        }
    }

    private void publishCartUpdated(Long userId, int itemCount) {
        kafkaTemplate.send(
                KafkaTopics.CART_UPDATED,
                String.valueOf(userId),
                new CartUpdatedEvent(
                        UUID.randomUUID().toString(),
                        userId,
                        itemCount,
                        Instant.now()));
    }
}
