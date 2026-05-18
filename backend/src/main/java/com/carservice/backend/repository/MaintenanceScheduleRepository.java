package com.carservice.backend.repository;

import com.carservice.backend.model.MaintenanceSchedule;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class MaintenanceScheduleRepository {
    private static final String FILE_NAME = "schedules.txt";

    public List<MaintenanceSchedule> findAll() {
        return FileUtil.readLines(FILE_NAME).stream()
                .map(MaintenanceSchedule::fromFileString)
                .collect(Collectors.toList());
    }

    public MaintenanceSchedule save(MaintenanceSchedule schedule) {
        List<MaintenanceSchedule> schedules = findAll();
        schedules.add(schedule);
        FileUtil.writeLines(FILE_NAME, schedules.stream().map(MaintenanceSchedule::toFileString).collect(Collectors.toList()));
        return schedule;
    }

    public List<MaintenanceSchedule> findByVehicleId(String vehicleId) {
        return findAll().stream()
                .filter(s -> s.getVehicleId().equals(vehicleId))
                .collect(Collectors.toList());
    }
}
