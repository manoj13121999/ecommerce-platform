package com.ecommerce.user.service;

import com.ecommerce.user.dto.AdminUserDetailResponse;
import com.ecommerce.user.dto.AdminUserPageResponse;
import com.ecommerce.user.dto.AdminUserSummaryResponse;
import com.ecommerce.user.dto.UpdateUserAdminRequest;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.repository.UserRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserAdminService {

    private final UserRepository userRepository;

    public UserAdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public AdminUserPageResponse listUsers(String query, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findForAdmin(normalizeQuery(query), pageable);
        List<AdminUserSummaryResponse> content = users.getContent().stream()
                .map(this::toSummary)
                .toList();
        return new AdminUserPageResponse(
                content,
                users.getNumber(),
                users.getSize(),
                users.getTotalElements(),
                users.getTotalPages());
    }

    @Transactional(readOnly = true)
    public AdminUserDetailResponse getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return toDetail(user);
    }

    @Transactional
    public AdminUserDetailResponse updateUser(User admin, Long userId, UpdateUserAdminRequest request) {
        if (admin.getId().equals(userId)) {
            if (!request.enabled() || request.role() != admin.getRole()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot change your own role or disable your account");
            }
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setRole(request.role());
        user.setEnabled(request.enabled());
        return toDetail(userRepository.save(user));
    }

    private AdminUserSummaryResponse toSummary(User user) {
        return new AdminUserSummaryResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt());
    }

    private AdminUserDetailResponse toDetail(User user) {
        return new AdminUserDetailResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    private String normalizeQuery(String query) {
        return query == null || query.isBlank() ? null : query.trim();
    }
}
