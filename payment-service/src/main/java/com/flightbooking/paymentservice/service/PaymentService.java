package com.flightbooking.paymentservice.service;

import com.flightbooking.paymentservice.dto.PaymentRequest;
import com.flightbooking.paymentservice.dto.PaymentResponse;
import com.flightbooking.paymentservice.entity.Payment;
import com.flightbooking.paymentservice.entity.PaymentStatus;
import com.flightbooking.paymentservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentResponse processPayment(PaymentRequest request) {
        PaymentStatus status = (Math.random() > 0.2)
                ? PaymentStatus.SUCCESS
                : PaymentStatus.FAILED;

        Payment payment = new Payment();
        payment.setBookingId(request.getBookingId());
        payment.setAmount(request.getAmount());
        payment.setPaymentStatus(status);
        payment.setPaymentMode(request.getPaymentMode());
        payment.setPaymentDate(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        return mapToResponse(payment);
    }

    public PaymentResponse getPaymentByBookingId(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException(
                        "No payment found for booking id: " + bookingId));
        return mapToResponse(payment);
    }

    private PaymentResponse mapToResponse(Payment p) {
        return new PaymentResponse(
                p.getId(), p.getBookingId(), p.getAmount(),
                p.getPaymentStatus(), p.getPaymentMode(), p.getPaymentDate()
        );
    }
}