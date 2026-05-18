package com.carservice.backend.controller;

import com.carservice.backend.util.FileUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DataController {

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<String> lines = FileUtil.readLines("users.txt");
        List<Map<String, String>> users = new ArrayList<>();
        
        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split(",");
            Map<String, String> user = new HashMap<>();
            user.put("id", parts[0]);
            user.put("name", parts[1]);
            user.put("email", parts[2]);
            user.put("role", parts[4]);
            users.add(user);
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/mechanics")
    public ResponseEntity<?> getAllMechanics() {
        List<String> lines = FileUtil.readLines("users.txt");
        List<Map<String, String>> mechanics = new ArrayList<>();
        
        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split(",");
            if (parts.length >= 5 && (parts[4].equals("MECHANIC") || parts[4].equals("SUPER_ADMIN"))) {
                Map<String, String> mechanic = new HashMap<>();
                mechanic.put("id", parts[0]);
                mechanic.put("name", parts[1]);
                mechanic.put("email", parts[2]);
                mechanic.put("role", parts[4]);
                mechanics.add(mechanic);
            }
        }
        return ResponseEntity.ok(mechanics);
    }

    @GetMapping("/vehicles")
    public ResponseEntity<?> getAllVehicles() {
        List<String> lines = FileUtil.readLines("vehicles.txt");
        List<Map<String, String>> vehicles = new ArrayList<>();
        
        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split(",");
            Map<String, String> vehicle = new HashMap<>();
            vehicle.put("id", parts[0]);
            vehicle.put("userId", parts[1]);
            vehicle.put("type", parts[2]);
            vehicle.put("model", parts[3]);
            vehicle.put("year", parts[4]);
            vehicle.put("licensePlate", parts.length > 7 ? parts[7] : "");
            vehicle.put("mileage", parts.length > 6 ? parts[6] : "0");
            vehicles.add(vehicle);
        }
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings() {
        List<String> lines = FileUtil.readLines("bookings.txt");
        List<Map<String, String>> bookings = new ArrayList<>();
        
        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split(",");
            Map<String, String> booking = new HashMap<>();
            booking.put("id", parts[0]);
            booking.put("vehicleId", parts[1]);
            booking.put("userId", parts[2]);
            booking.put("date", parts[3]);
            booking.put("service", parts[4]);
            booking.put("status", parts[5]);
            bookings.add(booking);
        }
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/payments")
    public ResponseEntity<?> getAllPayments() {
        List<String> lines = FileUtil.readLines("payments.txt");
        List<Map<String, String>> payments = new ArrayList<>();
        
        for (String line : lines) {
            if (line.trim().isEmpty()) continue;
            String[] parts = line.split(",");
            
            // Skip old format payments
            if (parts.length < 5) continue;
            
            Map<String, String> payment = new HashMap<>();
            payment.put("id", parts[0]);
            payment.put("amount", parts[1]);
            payment.put("date", parts[2]);
            payment.put("status", parts.length > 4 ? parts[4] : "PENDING");
            payment.put("userId", parts.length > 5 ? parts[5] : "");
            payment.put("bookingId", parts.length > 6 ? parts[6] : "");
            payments.add(payment);
        }
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Count users
        List<String> userLines = FileUtil.readLines("users.txt");
        int totalUsers = (int) userLines.stream().filter(l -> !l.trim().isEmpty()).count();
        int mechanics = (int) userLines.stream()
            .filter(l -> !l.trim().isEmpty() && (l.contains(",MECHANIC") || l.contains(",SUPER_ADMIN")))
            .count();
        int customers = totalUsers - mechanics;

        // Count vehicles
        List<String> vehicleLines = FileUtil.readLines("vehicles.txt");
        int totalVehicles = (int) vehicleLines.stream().filter(l -> !l.trim().isEmpty()).count();

        // Count bookings
        List<String> bookingLines = FileUtil.readLines("bookings.txt");
        int totalBookings = (int) bookingLines.stream().filter(l -> !l.trim().isEmpty()).count();
        int completedBookings = (int) bookingLines.stream()
            .filter(l -> !l.trim().isEmpty() && l.contains(",COMPLETED"))
            .count();
        int pendingBookings = (int) bookingLines.stream()
            .filter(l -> !l.trim().isEmpty() && !l.contains(",COMPLETED"))
            .count();

        // Sum payments
        List<String> paymentLines = FileUtil.readLines("payments.txt");
        double totalRevenue = paymentLines.stream()
            .filter(l -> !l.trim().isEmpty() && l.split(",").length >= 7)
            .mapToDouble(l -> {
                try {
                    return Double.parseDouble(l.split(",")[1]);
                } catch (Exception e) {
                    return 0;
                }
            })
            .sum();

        stats.put("totalUsers", totalUsers);
        stats.put("mechanics", mechanics);
        stats.put("customers", customers);
        stats.put("totalVehicles", totalVehicles);
        stats.put("totalBookings", totalBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("pendingBookings", pendingBookings);
        stats.put("totalRevenue", String.format("%.2f", totalRevenue));

        return ResponseEntity.ok(stats);
    }
}
