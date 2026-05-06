package com.carservice.backend.service;

import com.carservice.backend.model.Booking;
import com.carservice.backend.repository.BookingRepository;
import com.carservice.backend.util.IDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setId(IDGenerator.generate("B"));
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByCustomer(String customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public Booking updateBookingStatus(String id, String status) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    public Booking updateBooking(String id, Booking bookingData) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (bookingData.getServiceType() != null) {
            booking.setServiceType(bookingData.getServiceType());
        }
        if(bookingData.getVehicleId() != null)
        {
           booking.setVehicleId(bookingData.getVehicleId());
        }
        if (bookingData.getDate() != null) {
            booking.setDate(bookingData.getDate());
        }
        return bookingRepository.save(booking);
    }
}
