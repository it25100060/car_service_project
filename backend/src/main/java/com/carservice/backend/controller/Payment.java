package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Payment {
    private String id;
    private String serviceRecordId;
    private double amount;
    private String method; // CASH, DEBIT_CARD
    private String status; // PAID

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getServiceRecordId() { return serviceRecordId; }
    public void setServiceRecordId(String serviceRecordId) { this.serviceRecordId = serviceRecordId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String toFileString() {
        return String.join(",", id, serviceRecordId, String.valueOf(amount), method, status);
    }

    public static Payment fromFileString(String line) {
        String[] parts = line.split(",");
        Payment payment = new Payment();
        payment.setId(parts[0]);
        payment.setServiceRecordId(parts[1]);
        payment.setAmount(Double.parseDouble(parts[2]));
        payment.setMethod(parts[3]);
        payment.setStatus(parts[4]);
        return payment;
    }
}
