package com.flightbooking.paymentservice.dto;

import com.flightbooking.paymentservice.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private double amount;
    private PaymentStatus paymentStatus; // SUCCESS or FAILED
    private String paymentMode;
    private LocalDateTime paymentDate;
}