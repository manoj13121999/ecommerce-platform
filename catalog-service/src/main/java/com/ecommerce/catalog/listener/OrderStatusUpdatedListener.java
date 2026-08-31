package com.ecommerce.catalog.listener;

import com.ecommerce.catalog.service.InventoryService;
import com.ecommerce.common.event.KafkaTopics;
import com.ecommerce.common.event.OrderStatusUpdatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderStatusUpdatedListener {

    private final InventoryService inventoryService;

    public OrderStatusUpdatedListener(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @KafkaListener(
            topics = KafkaTopics.ORDER_STATUS_UPDATED,
            groupId = "catalog-service",
            containerFactory = "orderStatusUpdatedKafkaListenerContainerFactory")
    public void onOrderStatusUpdated(OrderStatusUpdatedEvent event) {
        inventoryService.restoreIfCancelled(event);
    }
}
