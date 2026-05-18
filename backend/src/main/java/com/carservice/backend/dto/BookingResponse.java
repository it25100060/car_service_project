package com.carservice.backend.dto;

import com.carservice.backend.model.Booking;
import com.carservice.backend.model.Vehicle;
import lombok.Getter;




public class BookingResponse {
    private String id;
    private String date;
    private String serviceType;
    private String status;

    // instead of just vehicleId, include full vehicle details
    private String vehicleId;
    private String vehicleType;    // e.g. "SUV"
    private String vehicleMake;
    private String vehicleModel;
    private int    vehicleYear;
    private String licensePlate;
    private String imageUrl;

    public BookingResponse(Booking booking, Vehicle vehicle) {
        this.id = booking.getId();
        this.date = booking.getDate();
        this.serviceType = booking.getServiceType();
        this.status = booking.getStatus();
        this.vehicleId = booking.getVehicleId();

        if (vehicle != null) {
            this.vehicleMake   = vehicle.getMake();
            this.vehicleModel  = vehicle.getModel();
            this.vehicleYear   = vehicle.getYear();
            this.licensePlate  = vehicle.getLicensePlate();
            this.imageUrl      = vehicle.getImageUrl();
        } else {
            this.vehicleMake   = "Unknown";
            this.vehicleModel  = "";
            this.vehicleYear   = 0;
            this.licensePlate  = "";
            this.imageUrl      = "";
        }
    }
    public String getId()           { return id; }
    public String getDate()         { return date; }
    public String getServiceType()  { return serviceType; }
    public String getStatus()       { return status; }
    public String getVehicleId()    { return vehicleId; }
    public String getVehicleMake()  { return vehicleMake; }
    public String getVehicleModel() { return vehicleModel; }
    public int    getVehicleYear()  { return vehicleYear; }
    public String getLicensePlate() { return licensePlate; }
    public String getImageUrl()     { return imageUrl; }



}
