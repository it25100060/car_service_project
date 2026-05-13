package com.carservice.backend.dto;

import com.carservice.backend.model.Role;
import lombok.Data;

@Data
public class UserDTO {
    private String id;
    private String name;
    private String email;
    private Role role;
}
