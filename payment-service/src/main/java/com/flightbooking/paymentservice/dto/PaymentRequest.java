package com.flightbooking.paymentservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @Positive(message = "Amount must be positive")
    private double amount;

    @NotNull(message = "Payment mode is required")
    private String paymentMode; // "CARD", "UPI", "NET_BANKING"
}