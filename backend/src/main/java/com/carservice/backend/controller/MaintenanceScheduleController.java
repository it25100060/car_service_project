package com.carservice.backend.controller;

import com.carservice.backend.model.MaintenanceSchedule;
import com.carservice.backend.service.MaintenanceScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class MaintenanceScheduleController {
    @Autowired
    private MaintenanceScheduleService service;

    @PostMapping
    public ResponseEntity<?> addSchedule(@RequestBody MaintenanceSchedule schedule) {
        return ResponseEntity.ok(service.addSchedule(schedule));
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<?> getSchedules(@PathVariable String vehicleId) {
        return ResponseEntity.ok(service.getSchedulesByVehicle(vehicleId));
    }
}
