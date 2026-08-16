package com.ecommerce.catalog.service;

import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.common.event.OrderPaidEvent;
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
}
