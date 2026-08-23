package com.ecommerce.admin.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @GetMapping("/admin")
    public String dashboard(Model model, Authentication authentication) {
        model.addAttribute("title", "ShopVault Admin");
        model.addAttribute("phase", "Phase 4 complete — manage products and orders.");
        model.addAttribute("adminEmail", authentication.getName());
        return "dashboard";
    }
}
