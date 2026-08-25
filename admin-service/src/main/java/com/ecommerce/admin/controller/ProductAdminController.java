package com.ecommerce.admin.controller;

import com.ecommerce.admin.model.ProductForm;
import com.ecommerce.admin.client.CatalogAdminClient;
import com.ecommerce.admin.security.AdminSessionAuthFilter;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ProductAdminController {

    private final CatalogAdminClient catalogAdminClient;

    public ProductAdminController(CatalogAdminClient catalogAdminClient) {
        this.catalogAdminClient = catalogAdminClient;
    }

    @GetMapping("/admin/products")
    public String listProducts(
            Authentication authentication,
            HttpSession session,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String q,
            Model model) {
        String token = accessToken(session);
        var products = catalogAdminClient.listProducts(token, page, 20, q);
        model.addAttribute("products", products.content());
        model.addAttribute("page", products.page());
        model.addAttribute("totalPages", products.totalPages());
        model.addAttribute("totalElements", products.totalElements());
        model.addAttribute("q", q == null ? "" : q);
        model.addAttribute("adminEmail", authentication.getName());
        return "products/list";
    }

    @GetMapping("/admin/products/new")
    public String newProductForm(HttpSession session, Authentication authentication, Model model) {
        model.addAttribute("form", ProductForm.empty());
        model.addAttribute("categories", catalogAdminClient.listCategories());
        model.addAttribute("editMode", false);
        model.addAttribute("adminEmail", authentication.getName());
        return "products/form";
    }

    @PostMapping("/admin/products/new")
    public String createProduct(
            HttpSession session,
            @ModelAttribute ProductForm form,
            RedirectAttributes redirectAttributes) {
        try {
            catalogAdminClient.createProduct(accessToken(session), toPayload(form, true));
            redirectAttributes.addFlashAttribute("message", "Product created");
            return "redirect:/admin/products";
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
            return "redirect:/admin/products/new";
        }
    }

    @GetMapping("/admin/products/{id}/edit")
    public String editProductForm(
            @PathVariable Long id,
            HttpSession session,
            Authentication authentication,
            Model model) {
        var product = catalogAdminClient.getProduct(accessToken(session), id);
        model.addAttribute("form", ProductForm.from(product));
        model.addAttribute("productId", id);
        model.addAttribute("categories", catalogAdminClient.listCategories());
        model.addAttribute("editMode", true);
        model.addAttribute("adminEmail", authentication.getName());
        return "products/form";
    }

    @PostMapping("/admin/products/{id}/edit")
    public String updateProduct(
            @PathVariable Long id,
            HttpSession session,
            @ModelAttribute ProductForm form,
            RedirectAttributes redirectAttributes) {
        try {
            catalogAdminClient.updateProduct(accessToken(session), id, toPayload(form, false));
            redirectAttributes.addFlashAttribute("message", "Product updated");
            return "redirect:/admin/products";
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
            return "redirect:/admin/products/" + id + "/edit";
        }
    }

    @PostMapping("/admin/products/{id}/deactivate")
    public String deactivateProduct(
            @PathVariable Long id,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        catalogAdminClient.deactivateProduct(accessToken(session), id);
        redirectAttributes.addFlashAttribute("message", "Product deactivated");
        return "redirect:/admin/products";
    }

    private String accessToken(HttpSession session) {
        return (String) session.getAttribute(AdminSessionAuthFilter.ACCESS_TOKEN_SESSION_KEY);
    }

    private Map<String, Object> toPayload(ProductForm form, boolean create) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("categoryId", form.getCategoryId());
        payload.put("name", form.getName());
        if (form.getSlug() != null && !form.getSlug().isBlank()) {
            payload.put("slug", form.getSlug());
        }
        payload.put("description", form.getDescription());
        payload.put("price", form.getPrice() == null ? BigDecimal.ZERO : form.getPrice());
        payload.put("compareAtPrice", form.getCompareAtPrice());
        payload.put("stock", form.getStock() == null ? 0 : form.getStock());
        payload.put("imageUrl", form.getImageUrl());
        if (create) {
            payload.put("active", form.getActive() == null || form.getActive());
        } else {
            payload.put("active", form.getActive() != null && form.getActive());
        }
        return payload;
    }
}
