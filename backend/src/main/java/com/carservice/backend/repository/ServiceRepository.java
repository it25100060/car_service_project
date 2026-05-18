package com.carservice.backend.repository;

import com.carservice.backend.model.ServiceRecord;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ServiceRepository {
    private static final String FILE_NAME = "services.txt";

    public List<ServiceRecord> findAll() {
        return FileUtil.readLines(FILE_NAME).stream()
                .map(ServiceRecord::fromFileString)
                .collect(Collectors.toList());
    }

    public Optional<ServiceRecord> findById(String id) {
        return findAll().stream()
                .filter(s -> s.getId().equals(id))
                .findFirst();
    }

    public ServiceRecord save(ServiceRecord record) {
        List<ServiceRecord> records = findAll();
        records.removeIf(s -> s.getId().equals(record.getId()));
        records.add(record);
        FileUtil.writeLines(FILE_NAME, records.stream().map(ServiceRecord::toFileString).collect(Collectors.toList()));
        return record;
    }

    public void deleteById(String id) {
        List<ServiceRecord> records = findAll();
        records.removeIf(s -> s.getId().equals(id));
        FileUtil.writeLines(FILE_NAME, records.stream().map(ServiceRecord::toFileString).collect(Collectors.toList()));
    }
}
