package com.ecommerce.common.event;

public final class KafkaTopics {

    public static final String USER_REGISTERED = "user.registered";
    public static final String CART_UPDATED = "cart.updated";
    public static final String ORDER_PLACED = "order.placed";
    public static final String PAYMENT_COMPLETED = "payment.completed";

    private KafkaTopics() {
    }
}
