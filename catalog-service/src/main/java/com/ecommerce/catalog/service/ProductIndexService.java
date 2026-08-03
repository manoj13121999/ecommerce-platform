package com.ecommerce.catalog.service;

import com.ecommerce.catalog.document.ProductDocument;
import com.ecommerce.catalog.entity.Product;
import com.ecommerce.catalog.mapper.CatalogMapper;
import com.ecommerce.catalog.repository.ProductRepository;
import com.ecommerce.catalog.repository.ProductSearchRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductIndexService {

    private static final Logger log = LoggerFactory.getLogger(ProductIndexService.class);

    private final ProductRepository productRepository;
    private final ProductSearchRepository productSearchRepository;

    public ProductIndexService(
            ProductRepository productRepository,
            ProductSearchRepository productSearchRepository) {
        this.productRepository = productRepository;
        this.productSearchRepository = productSearchRepository;
    }

    public void indexProduct(Product product) {
        ProductDocument document = CatalogMapper.toProductDocument(product);
        productSearchRepository.save(document);
    }

    @Transactional(readOnly = true)
    public void reindexAll() {
        List<Product> products = productRepository.findAll();
        productSearchRepository.deleteAll();
        List<ProductDocument> documents = products.stream()
                .filter(Product::isActive)
                .map(CatalogMapper::toProductDocument)
                .toList();
        productSearchRepository.saveAll(documents);
        log.info("Indexed {} products into Elasticsearch", documents.size());
    }
}
