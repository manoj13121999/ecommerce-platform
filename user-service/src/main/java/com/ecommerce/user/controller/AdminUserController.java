package com.ecommerce.user.controller;

import com.ecommerce.user.dto.AdminUserDetailResponse;
import com.ecommerce.user.dto.AdminUserPageResponse;
import com.ecommerce.user.dto.UpdateUserAdminRequest;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.service.UserAdminService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserAdminService userAdminService;

    public AdminUserController(UserAdminService userAdminService) {
        this.userAdminService = userAdminService;
    }

    @GetMapping
    public AdminUserPageResponse listUsers(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return userAdminService.listUsers(q, page, size);
    }

    @GetMapping("/{userId}")
    public AdminUserDetailResponse getUser(@PathVariable Long userId) {
        return userAdminService.getUser(userId);
    }

    @PutMapping("/{userId}")
    public AdminUserDetailResponse updateUser(
            @AuthenticationPrincipal User admin,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserAdminRequest request) {
        return userAdminService.updateUser(admin, userId, request);
    }
}
