package com.flightbooking.paymentservice.repository;

import com.flightbooking.paymentservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // useful for looking up payment details for a given booking
    // e.g. "show me the payment record for booking #42"
    Optional<Payment> findByBookingId(Long bookingId);
}