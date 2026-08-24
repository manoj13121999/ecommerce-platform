package com.ecommerce.admin.controller;

import com.ecommerce.admin.client.UserAdminClient;
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
public class UserAdminController {

    private static final List<String> ROLES = List.of("CUSTOMER", "ADMIN");

    private final UserAdminClient userAdminClient;

    public UserAdminController(UserAdminClient userAdminClient) {
        this.userAdminClient = userAdminClient;
    }

    @GetMapping("/admin/users")
    public String listUsers(
            Authentication authentication,
            HttpSession session,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String q,
            Model model) {
        String token = accessToken(session);
        var users = userAdminClient.listUsers(token, page, 20, q);
        model.addAttribute("users", users.content());
        model.addAttribute("page", users.page());
        model.addAttribute("totalPages", users.totalPages());
        model.addAttribute("totalElements", users.totalElements());
        model.addAttribute("q", q == null ? "" : q);
        model.addAttribute("adminEmail", authentication.getName());
        return "users/list";
    }

    @GetMapping("/admin/users/{id}")
    public String userDetail(
            @PathVariable Long id,
            Authentication authentication,
            HttpSession session,
            Model model) {
        var user = userAdminClient.getUser(accessToken(session), id);
        model.addAttribute("user", user);
        model.addAttribute("roles", ROLES);
        model.addAttribute("adminEmail", authentication.getName());
        return "users/detail";
    }

    @PostMapping("/admin/users/{id}/update")
    public String updateUser(
            @PathVariable Long id,
            @RequestParam String role,
            @RequestParam(defaultValue = "false") boolean enabled,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        try {
            userAdminClient.updateUser(accessToken(session), id, role, enabled);
            redirectAttributes.addFlashAttribute("message", "User updated");
        } catch (Exception ex) {
            redirectAttributes.addFlashAttribute("error", ex.getMessage());
        }
        return "redirect:/admin/users/" + id;
    }

    private String accessToken(HttpSession session) {
        return (String) session.getAttribute(AdminSessionAuthFilter.ACCESS_TOKEN_SESSION_KEY);
    }
}
