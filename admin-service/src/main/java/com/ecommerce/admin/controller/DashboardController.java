package com.ecommerce.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @GetMapping("/admin")
    public String dashboard(Model model) {
        model.addAttribute("title", "Ecommerce Admin");
        model.addAttribute("phase", "Phases 1–3 live — users, catalog, cart, orders, and mock payments.");
        return "dashboard";
    }
}
