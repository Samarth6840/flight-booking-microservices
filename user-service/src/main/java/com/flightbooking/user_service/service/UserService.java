package com.flightbooking.user_service.service;

import com.flightbooking.user_service.dto.LoginRequest;
import com.flightbooking.user_service.dto.RegisterRequest;
import com.flightbooking.user_service.dto.UserResponse;
import com.flightbooking.user_service.entity.Role;
import com.flightbooking.user_service.entity.User;
import com.flightbooking.user_service.repository.UserRepository;
import com.flightbooking.user_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        long count = userRepository.count();
        user.setRole(count == 0 ? Role.ADMIN : Role.USER);

        User saved = userRepository.save(user);
        
        String token = jwtUtil.generateToken(saved.getId(), saved.getEmail(), saved.getRole().name());
        return mapToResponse(saved, token);
    }

    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return mapToResponse(user, token);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), null);
    }

    private UserResponse mapToResponse(User user, String token) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), token);
    }
}