package com.ecommerce.catalog.config;

import com.ecommerce.catalog.service.ProductIndexService;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class CatalogStartupIndexer {

    private final ProductIndexService productIndexService;

    public CatalogStartupIndexer(ProductIndexService productIndexService) {
        this.productIndexService = productIndexService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void indexProductsOnStartup() {
        productIndexService.reindexAll();
    }
}
