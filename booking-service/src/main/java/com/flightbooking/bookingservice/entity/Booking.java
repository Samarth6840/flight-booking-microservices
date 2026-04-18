package com.flightbooking.bookingservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A human-readable reference like "BK-a1b2c3d4" that the user
    // would see on their ticket — more meaningful than a raw database id.
    @Column(unique = true, nullable = false)
    private String bookingRef;

    // We store only the IDs here, NOT the full User or Flight objects.
    // This is a critical microservices principle — the Booking Service
    // owns its own data and references other services by ID only.
    // It never copies user or flight data into its own database.
    private Long userId;
    private Long flightId;

    private int seatCount;       // how many seats this booking covers
    private double totalAmount;  // fare × seatCount, calculated at booking time

    @Enumerated(EnumType.STRING) // store "CONFIRMED" as text, not 0/1/2/3
    private BookingStatus status;

    private LocalDateTime bookingDate; // when the booking was created
}