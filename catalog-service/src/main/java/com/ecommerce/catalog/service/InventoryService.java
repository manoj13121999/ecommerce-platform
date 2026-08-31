package com.ecommerce.catalog.service;

import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.common.event.OrderPaidEvent;
import com.ecommerce.common.event.OrderStatusUpdatedEvent;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    private final ProductRepository productRepository;
    private final ProductIndexService productIndexService;

    public InventoryService(ProductRepository productRepository, ProductIndexService productIndexService) {
        this.productRepository = productRepository;
        this.productIndexService = productIndexService;
    }

    @Transactional
    public void applyOrderPaid(OrderPaidEvent event) {
        for (OrderPaidEvent.OrderPaidItem item : event.items()) {
            Product product = productRepository.findActiveById(item.productId()).orElse(null);
            if (product == null) {
                continue;
            }

            product.setStock(Math.max(0, product.getStock() - item.quantity()));
            productRepository.save(product);
            productIndexService.indexProduct(product);
        }
    }

    @Transactional
    public void restoreIfCancelled(OrderStatusUpdatedEvent event) {
        if (!"CANCELLED".equals(event.newStatus())) {
            return;
        }
        if (!Set.of("PAID", "SHIPPED").contains(event.previousStatus())) {
            return;
        }
        if (event.items() == null) {
            return;
        }

        for (OrderStatusUpdatedEvent.StatusLineItem item : event.items()) {
            Product product = productRepository.findById(item.productId()).orElse(null);
            if (product == null) {
                continue;
            }
            product.setStock(product.getStock() + item.quantity());
            productRepository.save(product);
            productIndexService.indexProduct(product);
        }
    }
}
