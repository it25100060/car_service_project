package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class User {
    private String id;
    private String name;
    private String email;
    private String password;
    private Role role;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String toFileString() {
        return String.join(",", id, name, email, password, role.name());
    }

    public static User fromFileString(String line) {
        String[] parts = line.split(",");
        User user = new User();
        user.setId(parts[0]);
        user.setName(parts[1]);
        user.setEmail(parts[2]);
        user.setPassword(parts[3]);
        user.setRole(Role.valueOf(parts[4]));
        return user;
    }
}
