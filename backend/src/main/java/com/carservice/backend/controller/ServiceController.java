package com.carservice.backend.controller;

import com.carservice.backend.model.ServiceRecord;
import com.carservice.backend.service.ServiceRecordService;
import com.carservice.backend.dto.ServiceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {
    @Autowired
    private ServiceRecordService serviceRecordService;

    @PostMapping
    public ResponseEntity<?> createService(@RequestBody ServiceDTO serviceDTO) {
        try {
            // Validate input
            if (serviceDTO.getBookingId() == null || serviceDTO.getBookingId().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Booking ID is required");
                return ResponseEntity.badRequest().body(error);
            }
            if (serviceDTO.getDescription() == null || serviceDTO.getDescription().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Description is required");
                return ResponseEntity.badRequest().body(error);
            }
            if (serviceDTO.getCost() < 0) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cost must be positive");
                return ResponseEntity.badRequest().body(error);
            }

            // Create service record
            ServiceRecord record = new ServiceRecord();
            record.setBookingId(serviceDTO.getBookingId());
            record.setDescription(serviceDTO.getDescription());
            record.setCost(serviceDTO.getCost());
            record.setStatus(serviceDTO.getStatus() != null ? serviceDTO.getStatus() : "COMPLETED");

            ServiceRecord saved = serviceRecordService.completeService(record);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllRecords() {
        return ResponseEntity.ok(serviceRecordService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecordById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(serviceRecordService.getRecordById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getServicesByBookingId(@PathVariable String bookingId) {
        return ResponseEntity.ok(serviceRecordService.getRecordsByBookingId(bookingId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable String id, @RequestBody ServiceDTO updates) {
        try {
            ServiceRecord updateRecord = new ServiceRecord();
            if (updates.getDescription() != null) {
                updateRecord.setDescription(updates.getDescription());
            }
            if (updates.getCost() > 0) {
                updateRecord.setCost(updates.getCost());
            }
            if (updates.getStatus() != null) {
                updateRecord.setStatus(updates.getStatus());
            }

            ServiceRecord updated = serviceRecordService.updateRecord(id, updateRecord);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        try {
            serviceRecordService.deleteRecord(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
