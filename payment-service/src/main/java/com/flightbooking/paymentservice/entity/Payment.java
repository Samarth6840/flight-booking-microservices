package com.flightbooking.paymentservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which booking triggered this payment — just an ID reference, not a JPA join
    @Column(nullable = false)
    private Long bookingId;

    private double amount;

    @Enumerated(EnumType.STRING) // stores "SUCCESS" as text, not a number
    private PaymentStatus paymentStatus;

    private String paymentMode;      // e.g. "CARD", "UPI", "NET_BANKING"

    private LocalDateTime paymentDate;
}