package com.platform.user.controller;

import com.platform.user.model.User;
import com.platform.user.model.UserDTO;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import com.platform.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Get user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        var user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User not found");
    }
    
    /**
     * Get user by email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        var user = userService.getUserByEmail(email);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User not found");
    }
    
    /**
     * Get all users with pagination
     */
    @GetMapping
    public ResponseEntity<Page<User>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }
    
    /**
     * Get users by role
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<Page<User>> getUsersByRole(
            @PathVariable UserRole role,
            Pageable pageable) {
        return ResponseEntity.ok(userService.getUsersByRole(role, pageable));
    }
    
    /**
     * Get users by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<User>> getUsersByStatus(
            @PathVariable UserStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(userService.getUsersByStatus(status, pageable));
    }
    
    /**
     * Create a new user
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDTO userDTO) {
        if (userDTO.getEmail() == null || userDTO.getEmail().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is required");
        }
        if (userService.userExistsByEmail(userDTO.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User with this email already exists");
        }
        User createdUser = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
    
    /**
     * Update existing user
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable UUID id,
            @RequestBody UserDTO userDTO) {
        User updatedUser = userService.updateUser(id, userDTO);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User not found");
    }
    
    /**
     * Delete user
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User not found");
    }
}
