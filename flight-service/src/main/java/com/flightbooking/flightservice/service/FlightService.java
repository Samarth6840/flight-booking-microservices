package com.flightbooking.flightservice.service;

import com.flightbooking.flightservice.dto.FlightRequest;
import com.flightbooking.flightservice.dto.FlightResponse;
import com.flightbooking.flightservice.entity.Flight;
import com.flightbooking.flightservice.repository.FlightRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightResponse addFlight(FlightRequest request) {
        // prevent duplicate flight numbers
        if (flightRepository.findByFlightNumber(request.getFlightNumber()).isPresent()) {
            throw new RuntimeException("Flight number already exists: " + request.getFlightNumber());
        }
        Flight flight = mapToEntity(request);
        Flight saved = flightRepository.save(flight);
        return mapToResponse(saved);
    }

    public List<FlightResponse> getAllFlights() {
        // .stream() turns the list into a pipeline
        // .map() converts each Flight entity into a FlightResponse DTO
        // .collect() gathers the results back into a list
        return flightRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FlightResponse getFlightById(Long id) {
        Flight flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
        return mapToResponse(flight);
    }

    public List<FlightResponse> searchFlights(String source, String destination, LocalDate date) {
        // The user sends just a date like "2025-06-15".
        // We build the full start and end timestamps for that entire day:
        // startOfDay = 2025-06-15T00:00:00 (midnight)
        // endOfDay   = 2025-06-15T23:59:59 (last second of the day)
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        return flightRepository.searchFlights(source, destination, startOfDay, endOfDay)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FlightResponse updateFlight(Long id, FlightRequest request) {
        Flight existing = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));

        // update all fields on the existing entity (keeping the same id)
        existing.setFlightNumber(request.getFlightNumber());
        existing.setAirlineName(request.getAirlineName());
        existing.setSource(request.getSource());
        existing.setDestination(request.getDestination());
        existing.setDepartureTime(request.getDepartureTime());
        existing.setArrivalTime(request.getArrivalTime());
        existing.setFare(request.getFare());
        existing.setTotalSeats(request.getTotalSeats());

        return mapToResponse(flightRepository.save(existing));
    }

    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new RuntimeException("Flight not found with id: " + id);
        }
        flightRepository.deleteById(id);
    }

    // converts incoming DTO → Entity (for saving to DB)
    private Flight mapToEntity(FlightRequest req) {
        Flight f = new Flight();
        f.setFlightNumber(req.getFlightNumber());
        f.setAirlineName(req.getAirlineName());
        f.setSource(req.getSource());
        f.setDestination(req.getDestination());
        f.setDepartureTime(req.getDepartureTime());
        f.setArrivalTime(req.getArrivalTime());
        f.setFare(req.getFare());
        f.setTotalSeats(req.getTotalSeats());
        return f;
    }

    // converts Entity → outgoing DTO (for sending back to caller)
    private FlightResponse mapToResponse(Flight f) {
        return new FlightResponse(
                f.getId(), f.getFlightNumber(), f.getAirlineName(),
                f.getSource(), f.getDestination(),
                f.getDepartureTime(), f.getArrivalTime(),
                f.getFare(), f.getTotalSeats()
        );
    }
}