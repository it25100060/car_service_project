package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ServiceRecord {
    private String id;
    private String bookingId;
    private String description;
    private double cost;
    private String status;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String toFileString() {
        return String.join(",", id, bookingId, description, String.valueOf((long)cost), status);
    }

    public static ServiceRecord fromFileString(String line) {
        String[] parts = line.split(",");
        if (parts.length < 5) {
            throw new IllegalArgumentException("Invalid service record format");
        }
        ServiceRecord record = new ServiceRecord();
        record.setId(parts[0].trim());
        record.setBookingId(parts[1].trim());
        record.setDescription(parts[2].trim());
        record.setCost(Double.parseDouble(parts[3].trim()));
        record.setStatus(parts[4].trim());
        return record;
    }
}
