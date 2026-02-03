package com.platform.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.auth.service.JwtService;
import com.platform.user.model.User;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import com.platform.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        
        // Create test user with hashed password
        testUser = User.builder()
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .googleId("test_google_id")
                .passwordHash(passwordEncoder.encode("testPassword123"))
                .userRole(UserRole.STARTUP)
                .status(UserStatus.ACTIVE)
                .build();
        testUser = userRepository.save(testUser);
    }

    @Test
    void login_WithValidCredentials_ReturnsToken() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "testPassword123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void login_WithInvalidPassword_ReturnsUnauthorized() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "test@example.com");
        loginRequest.put("password", "wrongPassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }

    @Test
    void login_WithNonExistentEmail_ReturnsUnauthorized() throws Exception {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "nonexistent@example.com");
        loginRequest.put("password", "anyPassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }

    @Test
    void register_WithValidData_CreatesUserAndReturnsToken() throws Exception {
        Map<String, Object> registerRequest = new HashMap<>();
        registerRequest.put("email", "newuser@example.com");
        registerRequest.put("password", "newPassword123");
        registerRequest.put("firstName", "New");
        registerRequest.put("lastName", "User");
        registerRequest.put("userRole", "INVESTOR");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.user.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.user.userRole").value("INVESTOR"));

        // Verify user was created in database
        assertTrue(userRepository.findByEmail("newuser@example.com").isPresent());
    }

    @Test
    void register_WithExistingEmail_ReturnsConflict() throws Exception {
        Map<String, Object> registerRequest = new HashMap<>();
        registerRequest.put("email", "test@example.com"); // Already exists
        registerRequest.put("password", "password123");
        registerRequest.put("firstName", "Duplicate");
        registerRequest.put("lastName", "User");
        registerRequest.put("userRole", "STARTUP");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Email already registered"));
    }

    @Test
    void getCurrentUser_WithValidToken_ReturnsUser() throws Exception {
        String token = jwtService.generateToken(testUser.getId(), testUser.getEmail(), testUser.getUserRole().name());

        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("Test"));
    }

    @Test
    void getCurrentUser_WithoutToken_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("No token provided"));
    }

    @Test
    void getCurrentUser_WithInvalidToken_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer invalid_token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid token"));
    }

    @Test
    void refreshToken_WithValidRefreshToken_ReturnsNewAccessToken() throws Exception {
        String refreshToken = jwtService.generateRefreshToken(testUser.getId());

        Map<String, String> refreshRequest = new HashMap<>();
        refreshRequest.put("refreshToken", refreshToken);

        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
    }

    @Test
    void login_WithInactiveUser_ReturnsForbidden() throws Exception {
        // Create inactive user
        User inactiveUser = User.builder()
                .email("inactive@example.com")
                .firstName("Inactive")
                .lastName("User")
                .googleId("inactive_google_id")
                .passwordHash(passwordEncoder.encode("password123"))
                .userRole(UserRole.STARTUP)
                .status(UserStatus.SUSPENDED)
                .build();
        userRepository.save(inactiveUser);

        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "inactive@example.com");
        loginRequest.put("password", "password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Account is not active"));
    }
}
