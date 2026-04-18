package com.flightbooking.bookingservice.service;

import com.flightbooking.bookingservice.dto.*;
import com.flightbooking.bookingservice.entity.Booking;
import com.flightbooking.bookingservice.entity.BookingStatus;
import com.flightbooking.bookingservice.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RestTemplate restTemplate;

    // These URLs are read from application.properties.
    // Keeping URLs in config (not hardcoded) means you can change them
    // for Docker/Kubernetes without recompiling the code.
    @Value("${flight.service.url}")
    private String flightServiceUrl;

    @Value("${payment.service.url}")
    private String paymentServiceUrl;

    public BookingResponse createBooking(BookingRequest request) {

        // ── STEP 1: Fetch flight details from Flight Service ──────────────
        // restTemplate.getForObject() makes a GET request and deserializes
        // the JSON response directly into a FlightDto object.
        // If the flight doesn't exist, Flight Service returns 400 and
        // RestTemplate throws an exception, which our handler will catch.
        String flightUrl = flightServiceUrl + "/" + request.getFlightId();
        FlightDto flight = restTemplate.getForObject(flightUrl, FlightDto.class);

        if (flight == null) {
            throw new RuntimeException("Could not retrieve flight with id: " + request.getFlightId());
        }

        // ── STEP 2: Check seat availability ───────────────────────────────
        // Count seats already confirmed for this flight in our own database.
        int alreadyBooked = bookingRepository.sumSeatCountByFlightIdAndStatus(
                request.getFlightId(), BookingStatus.CONFIRMED
        );
        int availableSeats = flight.getTotalSeats() - alreadyBooked;

        if (request.getSeatCount() > availableSeats) {
            throw new RuntimeException(
                    "Not enough seats. Requested: " + request.getSeatCount() +
                            ", Available: " + availableSeats
            );
        }

        // ── STEP 3: Calculate total amount ────────────────────────────────
        double totalAmount = flight.getFare() * request.getSeatCount();

        // ── STEP 4: Create a PENDING booking first ────────────────────────
        // We save the booking as PENDING before attempting payment.
        // This gives us a bookingId to reference in the payment request.
        // Think of it as "holding" the seat while payment is processed.
        Booking booking = new Booking();
        booking.setBookingRef("BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setUserId(request.getUserId());
        booking.setFlightId(request.getFlightId());
        booking.setSeatCount(request.getSeatCount());
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookingDate(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);

        // ── STEP 5: Call Payment Service ──────────────────────────────────
        try {
            PaymentRequest paymentRequest = new PaymentRequest(
                    saved.getId(), totalAmount, "CARD"
            );

            // postForObject() makes a POST request, sends paymentRequest as JSON body,
            // and deserializes the response into PaymentResponse.
            PaymentResponse paymentResponse = restTemplate.postForObject(
                    paymentServiceUrl, paymentRequest, PaymentResponse.class
            );

            // ── STEP 6: Update booking status based on payment result ─────
            if (paymentResponse != null && "SUCCESS".equals(paymentResponse.getPaymentStatus())) {
                saved.setStatus(BookingStatus.CONFIRMED);
            } else {
                saved.setStatus(BookingStatus.FAILED);
            }

        } catch (Exception e) {
            // If Payment Service is down or unreachable, we mark the booking FAILED
            // rather than leaving it stuck in PENDING forever.
            saved.setStatus(BookingStatus.FAILED);
        }

        Booking finalBooking = bookingRepository.save(saved);
        return mapToResponse(finalBooking);
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return mapToResponse(booking);
    }

    public List<BookingResponse> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        // you can only cancel a CONFIRMED booking — not one that already failed
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException(
                    "Only CONFIRMED bookings can be cancelled. Current status: " + booking.getStatus()
            );
        }

        // cancelling releases the seats automatically because our seat check
        // only counts CONFIRMED bookings — a CANCELLED one won't count anymore
        booking.setStatus(BookingStatus.CANCELLED);
        return mapToResponse(bookingRepository.save(booking));
    }

    public void permanentDeleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    private BookingResponse mapToResponse(Booking b) {
        return new BookingResponse(
                b.getId(), b.getBookingRef(), b.getUserId(), b.getFlightId(),
                b.getSeatCount(), b.getTotalAmount(), b.getStatus(), b.getBookingDate()
        );
    }
}