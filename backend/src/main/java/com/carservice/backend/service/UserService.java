package com.carservice.backend.service;

import com.carservice.backend.model.User;
import com.carservice.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Add register method
    public User register(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        // Generate ID if not provided
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId("U-" + System.currentTimeMillis());
        }
        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(com.carservice.backend.model.Role.CUSTOMER);
        }
        System.out.println("[UserService] Saving user: " + user.getId());
        return userRepository.save(user);
    }

    // Add login method
    public User login(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password))
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
    }
}
