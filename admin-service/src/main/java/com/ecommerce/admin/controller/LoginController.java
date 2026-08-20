package com.ecommerce.admin.controller;

import com.ecommerce.admin.client.AdminApiModels.AuthResponse;
import com.ecommerce.admin.client.UserServiceClient;
import com.ecommerce.admin.security.AdminSessionAuthFilter;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    private final UserServiceClient userServiceClient;

    public LoginController(UserServiceClient userServiceClient) {
        this.userServiceClient = userServiceClient;
    }

    @GetMapping("/admin/login")
    public String loginPage(@RequestParam(required = false) String error, Model model) {
        if (error != null) {
            model.addAttribute("error", error);
        }
        return "login";
    }

    @PostMapping("/admin/login")
    public String login(
            @RequestParam String email,
            @RequestParam String password,
            HttpSession session) {
        try {
            AuthResponse auth = userServiceClient.login(email.trim(), password);
            if (auth.user() == null || !"ADMIN".equals(auth.user().role())) {
                return "redirect:/admin/login?error=Admin+access+required";
            }

            session.setAttribute(AdminSessionAuthFilter.ACCESS_TOKEN_SESSION_KEY, auth.accessToken());
            session.setAttribute(AdminSessionAuthFilter.ADMIN_EMAIL_SESSION_KEY, auth.user().email());
            return "redirect:/admin";
        } catch (IllegalArgumentException ex) {
            return "redirect:/admin/login?error=Invalid+email+or+password";
        }
    }
}
