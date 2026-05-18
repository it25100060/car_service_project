package com.carservice.backend.service;

import com.carservice.backend.model.Admin;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private static final String ADMIN_FILE = "admins.txt";

    public Admin authenticate(String username, String password) {
        return getAllAdmins().stream()
            .filter(admin -> admin.getUsername().equals(username) && admin.getPassword().equals(password))
            .findFirst()
            .orElse(null);
    }

    public Admin createAdmin(Admin admin) {
        String id = "A-" + System.nanoTime();
        admin.setId(id);
        admin.setActive(true);

        List<String> lines = FileUtil.readLines(ADMIN_FILE);
        lines.add(admin.toFileString());
        FileUtil.writeLines(ADMIN_FILE, lines);

        return admin;
    }

    public List<Admin> getAllAdmins() {
        return FileUtil.readLines(ADMIN_FILE).stream()
            .filter(line -> !line.trim().isEmpty())
            .map(Admin::fromFileString)
            .collect(Collectors.toList());
    }

    public Optional<Admin> getAdminById(String id) {
        return getAllAdmins().stream()
            .filter(admin -> admin.getId().equals(id))
            .findFirst();
    }

    public Optional<Admin> updateAdmin(String id, Admin adminUpdate) {
        List<Admin> admins = getAllAdmins();
        Optional<Admin> adminOpt = admins.stream()
            .filter(admin -> admin.getId().equals(id))
            .findFirst();

        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (adminUpdate.getUsername() != null) admin.setUsername(adminUpdate.getUsername());
            if (adminUpdate.getEmail() != null) admin.setEmail(adminUpdate.getEmail());
            if (adminUpdate.getPassword() != null) admin.setPassword(adminUpdate.getPassword());
            admin.setActive(adminUpdate.isActive());

            List<String> lines = admins.stream()
                .map(Admin::toFileString)
                .collect(Collectors.toList());
            FileUtil.writeLines(ADMIN_FILE, lines);
        }

        return adminOpt;
    }

    public boolean deleteAdmin(String id) {
        List<Admin> admins = getAllAdmins();
        
        // Prevent deletion if only one admin exists
        if (admins.size() <= 1) {
            throw new IllegalArgumentException("Cannot delete the last admin account");
        }

        List<Admin> updated = admins.stream()
            .filter(admin -> !admin.getId().equals(id))
            .collect(Collectors.toList());

        if (updated.size() < admins.size()) {
            List<String> lines = updated.stream()
                .map(Admin::toFileString)
                .collect(Collectors.toList());
            FileUtil.writeLines(ADMIN_FILE, lines);
            return true;
        }

        return false;
    }
}
