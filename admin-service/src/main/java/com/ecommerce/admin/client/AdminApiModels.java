package com.ecommerce.admin.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AdminApiModels {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AuthResponse(String accessToken, String tokenType, UserResponse user) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record UserResponse(Long id, String email, String firstName, String lastName, String phone, String role) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CategoryResponse(Long id, String name, String slug, String description, long productCount) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AdminProductResponse(
            Long id,
            String name,
            String slug,
            String description,
            BigDecimal price,
            BigDecimal compareAtPrice,
            int stock,
            String imageUrl,
            Long categoryId,
            String categoryName,
            boolean active
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AdminProductPageResponse(
            List<AdminProductResponse> content,
            int page,
            int size,
            long totalElements,
            int totalPages
    ) {
    }
}
