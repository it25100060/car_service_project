package com.carservice.backend.service;

import com.carservice.backend.model.MaintenanceSchedule;
import com.carservice.backend.repository.MaintenanceScheduleRepository;
import com.carservice.backend.util.IDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceScheduleService {
    @Autowired
    private MaintenanceScheduleRepository repository;

    public MaintenanceSchedule addSchedule(MaintenanceSchedule schedule) {
        if (schedule.getId() == null) {
            schedule.setId(IDGenerator.generate("SCH"));
        }
        return repository.save(schedule);
    }

    public List<MaintenanceSchedule> getSchedulesByVehicle(String vehicleId) {
        return repository.findByVehicleId(vehicleId);
    }
}
