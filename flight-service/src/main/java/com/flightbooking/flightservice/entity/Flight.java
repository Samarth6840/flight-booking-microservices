package com.flightbooking.flightservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Flight number is required")
    @Column(unique = true, nullable = false) // e.g. "AI-202" — must be unique
    private String flightNumber;

    @NotBlank(message = "Airline name is required")
    private String airlineName;

    @NotBlank(message = "Source is required")
    private String source;           // departure city, e.g. "Delhi"

    @NotBlank(message = "Destination is required")
    private String destination;      // arrival city, e.g. "Mumbai"

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime; // LocalDateTime stores date + time together

    @NotNull(message = "Arrival time is required")
    private LocalDateTime arrivalTime;

    @Positive(message = "Fare must be a positive number")
    private double fare;             // ticket price in rupees

    @Positive(message = "Total seats must be a positive number")
    private int totalSeats;          // total capacity of the aircraft
}