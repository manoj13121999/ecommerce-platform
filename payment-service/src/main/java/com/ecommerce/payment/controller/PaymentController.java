package com.ecommerce.payment.controller;

import com.ecommerce.payment.dto.PaymentResponse;
import com.ecommerce.payment.dto.ProcessPaymentRequest;
import com.ecommerce.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public PaymentResponse processPayment(
            Authentication authentication,
            @Valid @RequestBody ProcessPaymentRequest request) {
        return paymentService.processPayment(getUserId(authentication), request);
    }

    @GetMapping("/order/{orderId}")
    public PaymentResponse getPaymentForOrder(Authentication authentication, @PathVariable Long orderId) {
        return paymentService.getPaymentForOrder(getUserId(authentication), orderId);
    }

    private Long getUserId(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}
