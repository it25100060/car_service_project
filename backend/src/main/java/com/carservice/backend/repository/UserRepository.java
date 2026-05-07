package com.carservice.backend.repository;

import com.carservice.backend.model.User;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class UserRepository {
    private static final String FILE_NAME = "users.txt";

    public List<User> findAll() {
        return FileUtil.readLines(FILE_NAME).stream()
                .map(User::fromFileString)
                .collect(Collectors.toList());
    }

    public Optional<User> findByEmail(String email) {
        return findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public Optional<User> findById(String id) {
        return findAll().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst();
    }

    public User save(User user) {
        List<User> users = findAll();
        Optional<User> existing = users.stream().filter(u -> u.getId().equals(user.getId())).findFirst();
        
        if (existing.isPresent()) {
            users.remove(existing.get());
        }
        users.add(user);
        
        FileUtil.writeLines(FILE_NAME, users.stream().map(User::toFileString).collect(Collectors.toList()));
        return user;
    }

    public void deleteById(String id) {
        List<User> users = findAll();
        users.removeIf(u -> u.getId().equals(id));
        FileUtil.writeLines(FILE_NAME, users.stream().map(User::toFileString).collect(Collectors.toList()));
    }
}
