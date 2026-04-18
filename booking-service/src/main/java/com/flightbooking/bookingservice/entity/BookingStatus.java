package com.flightbooking.bookingservice.entity;

// These four states represent the complete lifecycle of a booking.
// PENDING  → booking created but payment not yet processed
// CONFIRMED → payment succeeded, seat is yours
// FAILED   → payment failed, no seat reserved
// CANCELLED → user cancelled after confirmation
public enum BookingStatus {
    PENDING,
    CONFIRMED,
    FAILED,
    CANCELLED
}