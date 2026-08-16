package com.ecommerce.catalog.listener;

import com.ecommerce.common.event.KafkaTopics;
import com.ecommerce.common.event.OrderPaidEvent;
import com.ecommerce.catalog.service.InventoryService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderPaidListener {

    private final InventoryService inventoryService;

    public OrderPaidListener(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @KafkaListener(
            topics = KafkaTopics.ORDER_PAID,
            groupId = "catalog-service",
            containerFactory = "orderPaidKafkaListenerContainerFactory")
    public void onOrderPaid(OrderPaidEvent event) {
        inventoryService.applyOrderPaid(event);
    }
}
