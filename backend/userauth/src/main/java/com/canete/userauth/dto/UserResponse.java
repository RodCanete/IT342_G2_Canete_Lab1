package com.canete.userauth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private Boolean isActive;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
