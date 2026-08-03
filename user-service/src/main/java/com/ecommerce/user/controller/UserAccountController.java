package com.ecommerce.user.controller;

import com.ecommerce.user.dto.AddWishlistRequest;
import com.ecommerce.user.dto.ChangePasswordRequest;
import com.ecommerce.user.dto.WishlistResponse;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.service.AuthService;
import com.ecommerce.user.service.WishlistService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserAccountController {

    private final AuthService authService;
    private final WishlistService wishlistService;

    public UserAccountController(AuthService authService, WishlistService wishlistService) {
        this.authService = authService;
        this.wishlistService = wishlistService;
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        return authService.changePassword(user, request);
    }

    @GetMapping("/wishlist")
    public WishlistResponse getWishlist(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user) {
        return wishlistService.getWishlist(user);
    }

    @GetMapping("/wishlist/{productId}")
    public Map<String, Boolean> isInWishlist(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        return Map.of("inWishlist", wishlistService.isInWishlist(user, productId));
    }

    @PostMapping("/wishlist")
    public WishlistResponse addToWishlist(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user,
            @Valid @RequestBody AddWishlistRequest request) {
        return wishlistService.addItem(user, request);
    }

    @DeleteMapping("/wishlist/{productId}")
    public WishlistResponse removeFromWishlist(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        return wishlistService.removeItem(user, productId);
    }
}
