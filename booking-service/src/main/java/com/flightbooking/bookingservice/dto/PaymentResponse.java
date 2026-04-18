package com.flightbooking.bookingservice.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private double amount;
    private String paymentStatus; // "SUCCESS" or "FAILED"
    private String paymentMode;
}