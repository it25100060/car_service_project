package com.carservice.backend.dto;

import com.carservice.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String name;
    private String email;
    private Role role;
}
