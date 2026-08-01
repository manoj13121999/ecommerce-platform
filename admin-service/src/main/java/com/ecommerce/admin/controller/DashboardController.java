package com.ecommerce.admin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    @GetMapping("/admin")
    public String dashboard(Model model) {
        model.addAttribute("title", "Ecommerce Admin");
        model.addAttribute("phase", "Phase 1 complete — User Service live. Catalog admin coming in Phase 2.");
        return "dashboard";
    }
}
