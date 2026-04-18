package com.flightbooking.bookingservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

// This class mirrors the FlightResponse from the Flight Service.
// When RestTemplate deserializes the JSON response from Flight Service,
// it maps the JSON fields into this class automatically.
@Data
public class FlightDto {
    private Long id;
    private String flightNumber;
    private String airlineName;
    private String source;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double fare;
    private int totalSeats;
}