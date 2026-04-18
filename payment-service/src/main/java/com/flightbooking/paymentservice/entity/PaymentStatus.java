package com.flightbooking.paymentservice.entity;

// A payment can only ever be in one of three states.
// PENDING  → payment initiated but not yet processed
// SUCCESS  → money went through successfully
// FAILED   → payment was declined or something went wrong
public enum PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED
}