package com.flightbooking.bookingservice.repository;

import com.flightbooking.bookingservice.entity.Booking;
import com.flightbooking.bookingservice.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // fetch all bookings for a specific user — used in "my bookings" screen
    List<Booking> findByUserId(Long userId);

    // this is how we check seat usage without a separate Seat Service:
    // count how many seats are already confirmed for a given flight
    // SQL equivalent: SELECT SUM(seat_count) FROM bookings
    //                 WHERE flight_id = ? AND status = 'CONFIRMED'
    // We use this to calculate: availableSeats = totalSeats - bookedSeats
    @org.springframework.data.jpa.repository.Query(
            "SELECT COALESCE(SUM(b.seatCount), 0) FROM Booking b " +
                    "WHERE b.flightId = :flightId AND b.status = :status"
    )
    int sumSeatCountByFlightIdAndStatus(
            @org.springframework.data.repository.query.Param("flightId") Long flightId,
            @org.springframework.data.repository.query.Param("status") BookingStatus status
    );
}