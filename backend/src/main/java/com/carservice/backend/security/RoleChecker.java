package com.carservice.backend.security;

import com.carservice.backend.model.Role;
import com.carservice.backend.model.User;
import org.springframework.stereotype.Component;

@Component
public class RoleChecker {
    public boolean hasRole(User user, Role role) {
        return user != null && user.getRole() == role;
    }

    public boolean isAdmin(User user) {
        return user != null && (user.getRole() == Role.ADMIN || user.getRole() == Role.SUPER_ADMIN);
    }
}
