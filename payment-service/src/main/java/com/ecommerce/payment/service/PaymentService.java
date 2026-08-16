package com.ecommerce.payment.service;

import com.ecommerce.common.event.KafkaTopics;
import com.ecommerce.common.event.PaymentCompletedEvent;
import com.ecommerce.payment.dto.PaymentResponse;
import com.ecommerce.payment.dto.ProcessPaymentRequest;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.repository.PaymentRepository;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentService {

    private static final java.util.Set<String> ALLOWED_METHODS = java.util.Set.of("CARD", "UPI");

    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public PaymentService(PaymentRepository paymentRepository, KafkaTemplate<String, Object> kafkaTemplate) {
        this.paymentRepository = paymentRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public PaymentResponse processPayment(Long userId, ProcessPaymentRequest request) {
        String method = request.paymentMethod().trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_METHODS.contains(method)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported payment method");
        }

        if (paymentRepository.findByOrderId(request.orderId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Order already paid");
        }

        Payment payment = new Payment();
        payment.setOrderId(request.orderId());
        payment.setUserId(userId);
        payment.setAmount(request.amount());
        payment.setPaymentMethod(method);
        payment.setPaymentReference("PAY-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        payment.setStatus("COMPLETED");

        Payment saved = paymentRepository.save(payment);

        kafkaTemplate.send(
                KafkaTopics.PAYMENT_COMPLETED,
                saved.getOrderId().toString(),
                new PaymentCompletedEvent(
                        UUID.randomUUID().toString(),
                        saved.getOrderId(),
                        userId,
                        request.customerEmail().trim().toLowerCase(),
                        saved.getPaymentReference(),
                        saved.getAmount(),
                        Instant.now()));

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentForOrder(Long userId, Long orderId) {
        Payment payment = paymentRepository.findByOrderIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
        return toResponse(payment);
    }

    private PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrderId(),
                payment.getPaymentMethod(),
                payment.getPaymentReference(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getCreatedAt());
    }
}
