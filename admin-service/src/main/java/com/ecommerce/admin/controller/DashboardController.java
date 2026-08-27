package com.ecommerce.admin.controller;

import com.ecommerce.admin.client.CatalogAdminClient;
import com.ecommerce.admin.client.OrderAdminClient;
import com.ecommerce.admin.client.UserAdminClient;
import com.ecommerce.admin.security.AdminSessionAuthFilter;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private final OrderAdminClient orderAdminClient;
    private final CatalogAdminClient catalogAdminClient;
    private final UserAdminClient userAdminClient;

    public DashboardController(
            OrderAdminClient orderAdminClient,
            CatalogAdminClient catalogAdminClient,
            UserAdminClient userAdminClient) {
        this.orderAdminClient = orderAdminClient;
        this.catalogAdminClient = catalogAdminClient;
        this.userAdminClient = userAdminClient;
    }

    @GetMapping("/admin")
    public String dashboard(Model model, Authentication authentication, HttpSession session) {
        String token = (String) session.getAttribute(AdminSessionAuthFilter.ACCESS_TOKEN_SESSION_KEY);

        var stats = orderAdminClient.getStats(token);
        var recentOrders = orderAdminClient.listOrders(token, 0, 8, null);
        var products = catalogAdminClient.listProducts(token, 0, 1, null);
        var users = userAdminClient.listUsers(token, 0, 1, null);

        model.addAttribute("title", "ShopVault Admin");
        model.addAttribute("adminEmail", authentication.getName());
        model.addAttribute("stats", stats);
        model.addAttribute("recentOrders", recentOrders.content());
        model.addAttribute("totalProducts", products.totalElements());
        model.addAttribute("totalUsers", users.totalElements());
        model.addAttribute("statuses", stats.ordersByStatus().keySet());

        long awaitingPayment = stats.ordersByStatus().getOrDefault("PLACED", 0L);
        long readyToShip = stats.ordersByStatus().getOrDefault("PAID", 0L);
        long inTransit = stats.ordersByStatus().getOrDefault("SHIPPED", 0L);

        model.addAttribute("awaitingPayment", awaitingPayment);
        model.addAttribute("readyToShip", readyToShip);
        model.addAttribute("inTransit", inTransit);

        return "dashboard";
    }
}
