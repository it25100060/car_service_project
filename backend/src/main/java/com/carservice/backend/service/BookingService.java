package com.carservice.backend.service;

import com.carservice.backend.model.Booking;
import com.carservice.backend.repository.BookingRepository;
import com.carservice.backend.util.IDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carservice.backend.dto.BookingResponse;
import com.carservice.backend.model.Vehicle;
import com.carservice.backend.repository.VehicleRepository;
import java.util.stream.Collectors;


import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    //
    @Autowired
    private VehicleRepository vehicleRepository;
    //

    public Booking createBooking(Booking booking) {
        booking.setId(IDGenerator.generate("B"));
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(booking -> {
                    Vehicle vehicle = vehicleRepository
                            .findById(booking.getVehicleId())
                            .orElse(null);
                    return new BookingResponse(booking, vehicle);
                })
                .collect(Collectors.toList());
    }

    // ── READ ONE──────────────────────────────────────────────
    public BookingResponse getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        Vehicle vehicle = vehicleRepository
                .findById(booking.getVehicleId())
                .orElse(null);
        return new BookingResponse(booking, vehicle);
    }

    // ── READ BY CUSTOMER ──────────────────────────────────────
    public List<BookingResponse> getBookingsByCustomer(String customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
                .map(booking -> {
                    Vehicle vehicle = vehicleRepository
                            .findById(booking.getVehicleId())
                            .orElse(null);
                    return new BookingResponse(booking, vehicle);
                })
                .collect(Collectors.toList());
    }

    // ── UPDATE STATUS ────────────────────────────────────────
    public Booking updateBookingStatus(String id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    // ── DELETE ────────────────────────────────────────────────
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    // ── UPDATE BOOKING ────────────────────────────────────────
    public Booking updateBooking(String id, Booking bookingData) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (bookingData.getServiceType() != null) {
            booking.setServiceType(bookingData.getServiceType());
        }
        if (bookingData.getVehicleId() != null) {
            booking.setVehicleId(bookingData.getVehicleId());
        }
        if (bookingData.getDate() != null) {
            booking.setDate(bookingData.getDate());
        }
        return bookingRepository.save(booking);
    }
}
