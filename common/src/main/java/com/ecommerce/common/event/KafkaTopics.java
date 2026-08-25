package com.ecommerce.common.event;

public final class KafkaTopics {

    public static final String USER_REGISTERED = "user.registered";
    public static final String PASSWORD_RESET_REQUESTED = "password.reset.requested";
    public static final String CART_UPDATED = "cart.updated";
    public static final String ORDER_PLACED = "order.placed";
    public static final String PAYMENT_COMPLETED = "payment.completed";
    public static final String ORDER_PAID = "order.paid";
    public static final String ORDER_STATUS_UPDATED = "order.status.updated";

    private KafkaTopics() {
    }
}
