package com.flightbooking.bookingservice.dto;

import com.flightbooking.bookingservice.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingRef;
    private Long userId;
    private Long flightId;
    private int seatCount;
    private double totalAmount;
    private BookingStatus status;
    private LocalDateTime bookingDate;
}