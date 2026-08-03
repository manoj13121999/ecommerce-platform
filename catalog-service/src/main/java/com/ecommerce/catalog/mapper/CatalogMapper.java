package com.ecommerce.catalog.mapper;

import com.ecommerce.catalog.document.ProductDocument;
import com.ecommerce.catalog.dto.CategoryResponse;
import com.ecommerce.catalog.dto.ProductResponse;
import com.ecommerce.catalog.entity.Category;
import com.ecommerce.catalog.entity.Product;

public final class CatalogMapper {

    private CatalogMapper() {
    }

    public static CategoryResponse toCategoryResponse(Category category, long productCount) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                productCount);
    }

    public static ProductResponse toProductResponse(Product product) {
        Category category = product.getCategory();
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getCompareAtPrice(),
                product.getStock(),
                product.getImageUrl(),
                category.getId(),
                category.getName());
    }

    public static ProductDocument toProductDocument(Product product) {
        Category category = product.getCategory();
        return new ProductDocument(
                product.getId(),
                product.getName(),
                product.getDescription(),
                category.getName(),
                category.getId(),
                product.getPrice(),
                product.getImageUrl(),
                product.isActive());
    }
}
