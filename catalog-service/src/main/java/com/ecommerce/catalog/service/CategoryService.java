package com.ecommerce.catalog.service;

import com.ecommerce.catalog.dto.CategoryResponse;
import com.ecommerce.catalog.mapper.CatalogMapper;
import com.ecommerce.catalog.repository.CategoryRepository;
import com.ecommerce.catalog.repository.ProductRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listCategories() {
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : productRepository.countActiveProductsByCategory()) {
            counts.put((Long) row[0], (Long) row[1]);
        }

        return categoryRepository.findAll().stream()
                .map(category -> CatalogMapper.toCategoryResponse(
                        category,
                        counts.getOrDefault(category.getId(), 0L)))
                .toList();
    }
}
