package com.carservice.backend.service;

import com.carservice.backend.model.ServiceRecord;
import com.carservice.backend.repository.ServiceRepository;
import com.carservice.backend.util.IDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceRecordService {
    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingService bookingService;

    public ServiceRecord completeService(ServiceRecord record) {
        record.setId(IDGenerator.generate("S"));
        record.setStatus("COMPLETED");
        bookingService.updateBookingStatus(record.getBookingId(), "COMPLETED");
        return serviceRepository.save(record);
    }

    public List<ServiceRecord> getAllRecords() {
        return serviceRepository.findAll();
    }

    public ServiceRecord getRecordById(String id) {
        return serviceRepository.findById(id).orElseThrow(() -> new RuntimeException("Service record not found"));
    }

    public List<ServiceRecord> getRecordsByBookingId(String bookingId) {
        return getAllRecords().stream()
                .filter(s -> s.getBookingId().equals(bookingId))
                .toList();
    }

    public ServiceRecord updateRecord(String id, ServiceRecord updates) {
        ServiceRecord record = getRecordById(id);
        if (updates.getDescription() != null) {
            record.setDescription(updates.getDescription());
        }
        if (updates.getCost() > 0) {
            record.setCost(updates.getCost());
        }
        if (updates.getStatus() != null) {
            record.setStatus(updates.getStatus());
        }
        return serviceRepository.save(record);
    }

    public void deleteRecord(String id) {
        getRecordById(id); // Verify exists
        serviceRepository.deleteById(id);
    }
}
