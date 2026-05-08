package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Vehicle {
    private String id;
    private String ownerId;
    private String make;
    private String model;
    private int year;
    private String vin;
    private int currentMileage;
    private String licensePlate;
    private String imageUrl;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    public int getCurrentMileage() { return currentMileage; }
    public void setCurrentMileage(int currentMileage) { this.currentMileage = currentMileage; }
    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String toFileString() {
        return String.join(",", 
            id, 
            ownerId, 
            make, 
            model, 
            String.valueOf(year), 
            vin, 
            String.valueOf(currentMileage), 
            licensePlate, 
            imageUrl != null ? imageUrl : ""
        );
    }

    public static Vehicle fromFileString(String line) {
        String[] parts = line.split(",");
        Vehicle vehicle = new Vehicle();
        vehicle.setId(parts[0]);
        vehicle.setOwnerId(parts[1]);
        vehicle.setMake(parts[2]);
        vehicle.setModel(parts[3]);
        vehicle.setYear(Integer.parseInt(parts[4]));
        vehicle.setVin(parts[5]);
        vehicle.setCurrentMileage(Integer.parseInt(parts[6]));
        vehicle.setLicensePlate(parts[7]);
        vehicle.setImageUrl(parts.length > 8 ? parts[8] : "");
        return vehicle;
    }
}
