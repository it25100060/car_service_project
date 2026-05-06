package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Booking {
    private String id;
    private String vehicleId;
    private String customerId;
    private String date;
    private String serviceType;
    private String status; // PENDING, COMPLETED, CANCELLED

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String toFileString() {
        return String.join(",", id, vehicleId, customerId, date, serviceType, status);
    }

    public static Booking fromFileString(String line) {
        String[] parts = line.split(",");
        Booking booking = new Booking();
        booking.setId(parts[0]);
        booking.setVehicleId(parts[1]);
        booking.setCustomerId(parts[2]);
        booking.setDate(parts[3]);
        booking.setServiceType(parts[4]);
        booking.setStatus(parts[5]);
        return booking;
    }
}
