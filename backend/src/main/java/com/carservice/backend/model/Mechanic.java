package com.carservice.backend.model;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class Mechanic extends User {
    private String specialization;
    private int experienceYears;

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
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    @Override
    public String toFileString() {
        return super.toFileString() + "," + specialization + "," + experienceYears;
    }

    public static Mechanic fromFileString(String line) {
        String[] parts = line.split(",");
        Mechanic mechanic = new Mechanic();
        mechanic.setId(parts[0]);
        mechanic.setName(parts[1]);
        mechanic.setEmail(parts[2]);
        mechanic.setPassword(parts[3]);
        mechanic.setRole(Role.MECHANIC);
        mechanic.setSpecialization(parts[5]);
        mechanic.setExperienceYears(Integer.parseInt(parts[6]));
        return mechanic;
    }
}
