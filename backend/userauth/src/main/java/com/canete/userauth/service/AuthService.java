package com.canete.userauth.service;

import com.canete.userauth.dto.RegisterRequest;
import com.canete.userauth.dto.LoginRequest;
import com.canete.userauth.dto.AuthResponse;
import com.canete.userauth.dto.UserResponse;
import com.canete.userauth.model.User;
import com.canete.userauth.repository.UserRepository;
import com.canete.userauth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(true);
        user.setRole("USER");

        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(request.getEmail());
        return new AuthResponse(token, request.getEmail(), "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new IllegalArgumentException("User account is inactive");
        }

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(request.getEmail());
        return new AuthResponse(token, request.getEmail(), "Login successful");
    }

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getIsActive(),
                user.getRole(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }
}
