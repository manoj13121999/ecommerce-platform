package com.ecommerce.admin.client;

import com.ecommerce.admin.client.AdminApiModels.AdminUserDetailResponse;
import com.ecommerce.admin.client.AdminApiModels.AdminUserPageResponse;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class UserAdminClient {

    private final RestClient restClient;

    public UserAdminClient(@Value("${app.user-service-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public AdminUserPageResponse listUsers(String token, int page, int size, String q) {
        return restClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/api/admin/users")
                            .queryParam("page", page)
                            .queryParam("size", size);
                    if (q != null && !q.isBlank()) {
                        builder.queryParam("q", q.trim());
                    }
                    return builder.build();
                })
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(AdminUserPageResponse.class);
    }

    public AdminUserDetailResponse getUser(String token, Long id) {
        return restClient.get()
                .uri("/api/admin/users/{id}", id)
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .body(AdminUserDetailResponse.class);
    }

    public AdminUserDetailResponse updateUser(String token, Long id, String role, boolean enabled) {
        return restClient.put()
                .uri("/api/admin/users/{id}", id)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("role", role, "enabled", enabled))
                .retrieve()
                .body(AdminUserDetailResponse.class);
    }
}
