package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class MaintenanceSchedule {
    private String id;
    private String vehicleId;
    private String task;
    private int intervalMileage;
    private int intervalMonths;
    private int lastCompletedMileage;
    private String lastCompletedDate;
    private int nextDueMileage;
    private String nextDueDate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
    public int getIntervalMileage() { return intervalMileage; }
    public void setIntervalMileage(int intervalMileage) { this.intervalMileage = intervalMileage; }
    public int getIntervalMonths() { return intervalMonths; }
    public void setIntervalMonths(int intervalMonths) { this.intervalMonths = intervalMonths; }
    public int getLastCompletedMileage() { return lastCompletedMileage; }
    public void setLastCompletedMileage(int lastCompletedMileage) { this.lastCompletedMileage = lastCompletedMileage; }
    public String getLastCompletedDate() { return lastCompletedDate; }
    public void setLastCompletedDate(String lastCompletedDate) { this.lastCompletedDate = lastCompletedDate; }
    public int getNextDueMileage() { return nextDueMileage; }
    public void setNextDueMileage(int nextDueMileage) { this.nextDueMileage = nextDueMileage; }
    public String getNextDueDate() { return nextDueDate; }
    public void setNextDueDate(String nextDueDate) { this.nextDueDate = nextDueDate; }

    public String toFileString() {
        return String.join(",", 
            id, 
            vehicleId, 
            task, 
            String.valueOf(intervalMileage), 
            String.valueOf(intervalMonths), 
            String.valueOf(lastCompletedMileage), 
            lastCompletedDate, 
            String.valueOf(nextDueMileage), 
            nextDueDate
        );
    }

    public static MaintenanceSchedule fromFileString(String line) {
        String[] parts = line.split(",");
        MaintenanceSchedule schedule = new MaintenanceSchedule();
        schedule.setId(parts[0]);
        schedule.setVehicleId(parts[1]);
        schedule.setTask(parts[2]);
        schedule.setIntervalMileage(Integer.parseInt(parts[3]));
        schedule.setIntervalMonths(Integer.parseInt(parts[4]));
        schedule.setLastCompletedMileage(Integer.parseInt(parts[5]));
        schedule.setLastCompletedDate(parts[6]);
        schedule.setNextDueMileage(Integer.parseInt(parts[7]));
        schedule.setNextDueDate(parts[8]);
        return schedule;
    }
}
