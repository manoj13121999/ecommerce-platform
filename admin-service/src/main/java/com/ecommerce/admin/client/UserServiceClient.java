package com.ecommerce.admin.client;

import com.ecommerce.admin.client.AdminApiModels.AuthResponse;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Service
public class UserServiceClient {

    private final RestClient restClient;

    public UserServiceClient(@Value("${app.user-service-url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public AuthResponse login(String email, String password) {
        try {
            return restClient.post()
                    .uri("/api/users/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("email", email, "password", password))
                    .retrieve()
                    .body(AuthResponse.class);
        } catch (RestClientResponseException ex) {
            throw new IllegalArgumentException("Invalid email or password");
        }
    }
}
