package com.flightbooking.flightservice.repository;

import com.flightbooking.flightservice.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    // This is a JPQL query — it looks like SQL but refers to Java class names
    // and field names, not table/column names. "f" is an alias for the Flight entity.
    // We search for flights where the departure date falls within the requested day
    // (from midnight to 11:59 PM of that day) — that way users search by date, not exact time.
    @Query("SELECT f FROM Flight f WHERE " +
            "LOWER(TRIM(f.source)) = LOWER(TRIM(:source)) AND " +           // case-insensitive match, ignore whitespace
            "LOWER(TRIM(f.destination)) = LOWER(TRIM(:destination)) AND " +
            "f.departureTime BETWEEN :startOfDay AND :endOfDay") // within the day
    List<Flight> searchFlights(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );
}