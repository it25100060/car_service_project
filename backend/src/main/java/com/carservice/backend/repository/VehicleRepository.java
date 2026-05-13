package com.carservice.backend.repository;

import com.carservice.backend.model.Vehicle;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class VehicleRepository {
    private static final String FILE_NAME = "vehicles.txt";

    public List<Vehicle> findAll() {
        return FileUtil.readLines(FILE_NAME).stream()
                .map(Vehicle::fromFileString)
                .collect(Collectors.toList());
    }

    public List<Vehicle> findByOwnerId(String ownerId) {
        return findAll().stream()
                .filter(v -> v.getOwnerId().equals(ownerId))
                .collect(Collectors.toList());
    }

    public Optional<Vehicle> findById(String id) {
        return findAll().stream()
                .filter(v -> v.getId().equals(id))
                .findFirst();
    }

    public Vehicle save(Vehicle vehicle) {
        List<Vehicle> vehicles = findAll();
        vehicles.removeIf(v -> v.getId().equals(vehicle.getId()));
        vehicles.add(vehicle);
        FileUtil.writeLines(FILE_NAME, vehicles.stream().map(Vehicle::toFileString).collect(Collectors.toList()));
        return vehicle;
    }

    public void deleteById(String id) {
        List<Vehicle> vehicles = findAll();
        vehicles.removeIf(v -> v.getId().equals(id));
        FileUtil.writeLines(FILE_NAME, vehicles.stream().map(Vehicle::toFileString).collect(Collectors.toList()));
    }
}
