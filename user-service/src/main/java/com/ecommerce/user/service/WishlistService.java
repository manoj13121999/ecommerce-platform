package com.ecommerce.user.service;

import com.ecommerce.user.dto.AddWishlistRequest;
import com.ecommerce.user.dto.WishlistItemResponse;
import com.ecommerce.user.dto.WishlistResponse;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.entity.WishlistItem;
import com.ecommerce.user.repository.WishlistItemRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;

    public WishlistService(WishlistItemRepository wishlistItemRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
    }

    @Transactional(readOnly = true)
    public WishlistResponse getWishlist(User user) {
        List<WishlistItemResponse> items = wishlistItemRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(item -> new WishlistItemResponse(item.getProductId(), item.getCreatedAt()))
                .toList();
        return new WishlistResponse(items, items.size());
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(User user, Long productId) {
        return wishlistItemRepository.existsByUserIdAndProductId(user.getId(), productId);
    }

    @Transactional
    public WishlistResponse addItem(User user, AddWishlistRequest request) {
        if (wishlistItemRepository.existsByUserIdAndProductId(user.getId(), request.productId())) {
            return getWishlist(user);
        }

        WishlistItem item = new WishlistItem();
        item.setUserId(user.getId());
        item.setProductId(request.productId());
        wishlistItemRepository.save(item);
        return getWishlist(user);
    }

    @Transactional
    public WishlistResponse removeItem(User user, Long productId) {
        if (!wishlistItemRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not in wishlist");
        }
        wishlistItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
        return getWishlist(user);
    }
}
