package com.carservice.backend.repository;

import com.carservice.backend.model.Booking;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class BookingRepository {
    private static final String FILE_NAME = "bookings.txt";

    public List<Booking> findAll() {
        return FileUtil.readLines(FILE_NAME).stream()
                .map(Booking::fromFileString)
                .collect(Collectors.toList());
    }

    public List<Booking> findByCustomerId(String customerId) {
        return findAll().stream()
                .filter(b -> b.getCustomerId().equals(customerId))
                .collect(Collectors.toList());
    }

    public Optional<Booking> findById(String id) {
        return findAll().stream()
                .filter(b -> b.getId().equals(id))
                .findFirst();
    }

    public Booking save(Booking booking) {
        List<Booking> bookings = findAll();
        bookings.removeIf(b -> b.getId().equals(booking.getId()));
        bookings.add(booking);
        FileUtil.writeLines(FILE_NAME, bookings.stream().map(Booking::toFileString).collect(Collectors.toList()));
        return booking;
    }

    public void deleteById(String id) {
        List<Booking> bookings = findAll();
        bookings.removeIf(b -> b.getId().equals(id));
        FileUtil.writeLines(FILE_NAME, bookings.stream().map(Booking::toFileString).collect(Collectors.toList()));
    }
}
