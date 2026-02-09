package com.canete.userauth.controller;

import com.canete.userauth.dto.RegisterRequest;
import com.canete.userauth.dto.LoginRequest;
import com.canete.userauth.dto.AuthResponse;
import com.canete.userauth.dto.UserResponse;
import com.canete.userauth.service.AuthService;
import com.canete.userauth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token format");
        }

        String jwtToken = token.substring(7);
        if (!jwtTokenProvider.validateToken(jwtToken)) {
            throw new IllegalArgumentException("Invalid or expired token");
        }

        String email = jwtTokenProvider.getEmailFromToken(jwtToken);
        UserResponse response = authService.getUserByEmail(email);
        return ResponseEntity.ok(response);
    }
}
