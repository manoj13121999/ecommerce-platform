package com.ecommerce.catalog.service;

import org.springframework.data.domain.Sort;

public final class ProductSortMapper {

    private ProductSortMapper() {
    }

    public static Sort toSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by("name").ascending();
        }
        return switch (sort) {
            case "name_desc" -> Sort.by("name").descending();
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "newest" -> Sort.by("createdAt").descending();
            default -> Sort.by("name").ascending();
        };
    }
}
