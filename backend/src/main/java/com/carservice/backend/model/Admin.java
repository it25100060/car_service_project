package com.carservice.backend.model;

public class Admin {
    private String id;
    private String username;
    private String email;
    private String password;
    private boolean active;

    public Admin() {}

    public Admin(String id, String username, String email, String password, boolean active) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String toFileString() {
        return id + "," + username + "," + email + "," + password + "," + active;
    }

    public static Admin fromFileString(String line) {
        String[] parts = line.split(",");
        return new Admin(
            parts[0],
            parts[1],
            parts[2],
            parts[3],
            Boolean.parseBoolean(parts[4])
        );
    }
}
