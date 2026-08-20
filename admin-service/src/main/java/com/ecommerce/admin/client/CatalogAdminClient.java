package com.ecommerce.admin.client;

import com.ecommerce.admin.client.AdminApiModels.AdminProductPageResponse;
import com.ecommerce.admin.client.AdminApiModels.AdminProductResponse;
import com.ecommerce.admin.client.AdminApiModels.CategoryResponse;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class CatalogAdminClient {

    private final RestClient restClient;

    public CatalogAdminClient(@Value("${app.catalog-service-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public AdminProductPageResponse listProducts(String token, int page, int size, String q) {
        return restClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/api/admin/products")
                            .queryParam("page", page)
                            .queryParam("size", size);
                    if (q != null && !q.isBlank()) {
                        builder.queryParam("q", q.trim());
                    }
                    return builder.build();
                })
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(AdminProductPageResponse.class);
    }

    public AdminProductResponse getProduct(String token, Long id) {
        return restClient.get()
                .uri("/api/admin/products/{id}", id)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(AdminProductResponse.class);
    }

    public AdminProductResponse createProduct(String token, Map<String, Object> body) {
        return restClient.post()
                .uri("/api/admin/products")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(AdminProductResponse.class);
    }

    public AdminProductResponse updateProduct(String token, Long id, Map<String, Object> body) {
        return restClient.put()
                .uri("/api/admin/products/{id}", id)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(AdminProductResponse.class);
    }

    public void deactivateProduct(String token, Long id) {
        restClient.delete()
                .uri("/api/admin/products/{id}", id)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .toBodilessEntity();
    }

    public List<CategoryResponse> listCategories() {
        return restClient.get()
                .uri("/api/categories")
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }
}
