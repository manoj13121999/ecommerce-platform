package com.ecommerce.admin.client;

import com.ecommerce.admin.client.AdminApiModels.AdminOrderPageResponse;
import com.ecommerce.admin.client.AdminApiModels.AdminOrderStatsResponse;
import com.ecommerce.admin.client.AdminApiModels.OrderDetailResponse;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class OrderAdminClient {

    private final RestClient restClient;

    public OrderAdminClient(@Value("${app.order-service-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public AdminOrderPageResponse listOrders(String token, int page, int size, String status) {
        return restClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/api/admin/orders")
                            .queryParam("page", page)
                            .queryParam("size", size);
                    if (status != null && !status.isBlank()) {
                        builder.queryParam("status", status.trim());
                    }
                    return builder.build();
                })
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(AdminOrderPageResponse.class);
    }

    public AdminOrderStatsResponse getStats(String token) {
        return restClient.get()
                .uri("/api/admin/orders/stats")
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(AdminOrderStatsResponse.class);
    }

    public OrderDetailResponse getOrder(String token, Long id) {
        return restClient.get()
                .uri("/api/admin/orders/{id}", id)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(OrderDetailResponse.class);
    }

    public OrderDetailResponse updateStatus(String token, Long id, String status, String customerEmail) {
        return restClient.put()
                .uri("/api/admin/orders/{id}/status", id)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "status", status,
                        "customerEmail", customerEmail == null ? "" : customerEmail))
                .retrieve()
                .body(OrderDetailResponse.class);
    }
}
