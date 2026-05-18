package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Customer extends User {
    private String phoneNumber;
    private String address;

    public String getId() { return super.getId(); }
    public void setId(String id) { super.setId(id); }
    public String getName() { return super.getName(); }
    public void setName(String name) { super.setName(name); }
    public String getEmail() { return super.getEmail(); }
    public void setEmail(String email) { super.setEmail(email); }
    public String getPassword() { return super.getPassword(); }
    public void setPassword(String password) { super.setPassword(password); }
    public Role getRole() { return super.getRole(); }
    public void setRole(Role role) { super.setRole(role); }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    @Override
    public String toFileString() {
        return super.toFileString() + "," + phoneNumber + "," + address;
    }

    public static Customer fromFileString(String line) {
        String[] parts = line.split(",");
        Customer customer = new Customer();
        customer.setId(parts[0]);
        customer.setName(parts[1]);
        customer.setEmail(parts[2]);
        customer.setPassword(parts[3]);
        customer.setRole(Role.CUSTOMER);
        customer.setPhoneNumber(parts[5]);
        customer.setAddress(parts[6]);
        return customer;
    }
}
