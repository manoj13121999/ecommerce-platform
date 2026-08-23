package com.ecommerce.admin.controller;

import com.ecommerce.admin.client.OrderAdminClient;
import com.ecommerce.admin.security.AdminSessionAuthFilter;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class OrderAdminController {

    private static final List<String> STATUSES = List.of(
            "PLACED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED");

    private final OrderAdminClient orderAdminClient;

    public OrderAdminController(OrderAdminClient orderAdminClient) {
        this.orderAdminClient = orderAdminClient;
    }

    @GetMapping("/admin/orders")
    public String listOrders(
            Authentication authentication,
            HttpSession session,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String status,
            Model model) {
        String token = accessToken(session);
        var orders = orderAdminClient.listOrders(token, page, 20, status);
        model.addAttribute("orders", orders.content());
        model.addAttribute("page", orders.page());
        model.addAttribute("totalPages", orders.totalPages());
        model.addAttribute("totalElements", orders.totalElements());
        model.addAttribute("status", status == null ? "" : status);
        model.addAttribute("statuses", STATUSES);
        model.addAttribute("adminEmail", authentication.getName());
        return "orders/list";
    }

    @GetMapping("/admin/orders/{id}")
    public String orderDetail(
            @PathVariable Long id,
            Authentication authentication,
            HttpSession session,
            Model model) {
        var order = orderAdminClient.getOrder(accessToken(session), id);
        model.addAttribute("order", order);
        model.addAttribute("statuses", STATUSES);
        model.addAttribute("adminEmail", authentication.getName());
        return "orders/detail";
    }

    @PostMapping("/admin/orders/{id}/status")
    public String updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        try {
            orderAdminClient.updateStatus(accessToken(session), id, status);
            redirectAttributes.addFlashAttribute("message", "Order status updated");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/admin/orders/" + id;
    }

    private String accessToken(HttpSession session) {
        return (String) session.getAttribute(AdminSessionAuthFilter.ACCESS_TOKEN_SESSION_KEY);
    }
}
