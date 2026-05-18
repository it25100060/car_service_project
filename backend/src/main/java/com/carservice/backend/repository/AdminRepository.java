package com.carservice.backend.repository;

import com.carservice.backend.model.Admin;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class AdminRepository {
    private static final String FILE_NAME = "admins.txt";

    public List<Admin> findAll() {
        return FileUtil.readLines(FILE_NAME).stream()
                .map(Admin::fromFileString)
                .collect(Collectors.toList());
    }

    public Optional<Admin> findById(String id) {
        return findAll().stream()
                .filter(a -> a.getId().equals(id))
                .findFirst();
    }

    public Admin save(Admin admin) {
        List<Admin> admins = findAll();
        admins.removeIf(a -> a.getId().equals(admin.getId()));
        admins.add(admin);
        FileUtil.writeLines(FILE_NAME, admins.stream().map(Admin::toFileString).collect(Collectors.toList()));
        return admin;
    }

    public void deleteById(String id) {
        List<Admin> admins = findAll();
        admins.removeIf(a -> a.getId().equals(id));
        FileUtil.writeLines(FILE_NAME, admins.stream().map(Admin::toFileString).collect(Collectors.toList()));
    }
}
