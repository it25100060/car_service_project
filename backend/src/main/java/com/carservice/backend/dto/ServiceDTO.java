package com.carservice.backend.dto;

public class ServiceDTO {
    private String bookingId;
    private String description;
    private double cost;
    private String status;

    public ServiceDTO() {}
    
    public ServiceDTO(String bookingId, String description, double cost, String status) {
        this.bookingId = bookingId;
        this.description = description;
        this.cost = cost;
        this.status = status;
    }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
