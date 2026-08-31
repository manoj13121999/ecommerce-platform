package com.ecommerce.order.client;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

@Component
public class CatalogClient {

    private final RestClient restClient;

    public CatalogClient(
            RestClient.Builder builder,
            @Value("${app.catalog.base-url:http://127.0.0.1:8082}") String catalogBaseUrl) {
        this.restClient = builder.baseUrl(catalogBaseUrl).build();
    }

    public List<ValidatedCatalogItem> validateItems(List<CatalogItemRequest> items) {
        ValidateItemsResponse response;
        try {
            response = restClient.post()
                    .uri("/api/products/validate")
                    .body(new ValidateItemsRequest(items))
                    .retrieve()
                    .body(ValidateItemsResponse.class);
        } catch (RestClientException ex) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Catalog is unavailable. Try checkout again in a moment.");
        }

        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Catalog returned an empty response");
        }
        if (!response.valid()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    response.message() != null ? response.message() : "Some items cannot be purchased");
        }
        return response.items();
    }

    public record CatalogItemRequest(Long productId, int quantity) {
    }

    public record ValidateItemsRequest(List<CatalogItemRequest> items) {
    }

    public record ValidateItemsResponse(boolean valid, String message, List<ValidatedCatalogItem> items) {
    }

    public record ValidatedCatalogItem(
            Long productId,
            String productName,
            BigDecimal price,
            String imageUrl,
            int quantity,
            int availableStock,
            boolean valid,
            String message
    ) {
    }
}
