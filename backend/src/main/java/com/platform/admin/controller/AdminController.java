package com.platform.admin.controller;

import com.platform.admin.model.DashboardStats;
import com.platform.admin.model.UserManagementDTO;
import com.platform.admin.service.AdminService;
import com.platform.user.model.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * Get dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get all users with pagination
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserManagementDTO>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<UserManagementDTO> users = adminService.getAllUsers(role, status, search, pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * Get user details by ID
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        var user = adminService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
    }

    /**
     * Update user status (activate, suspend, delete)
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable UUID id,
            @RequestBody StatusUpdateRequest request) {
        try {
            UserStatus newStatus = UserStatus.valueOf(request.getStatus().toUpperCase());
            var updatedUser = adminService.updateUserStatus(id, newStatus);
            if (updatedUser != null) {
                return ResponseEntity.ok(updatedUser);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid status: " + request.getStatus()));
        }
    }

    /**
     * Delete user permanently (hard delete)
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        boolean deleted = adminService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
    }

    /**
     * Get all startups with admin details
     */
    @GetMapping("/startups")
    public ResponseEntity<?> getAllStartups(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        var startups = adminService.getAllStartups(status, search, pageable);
        return ResponseEntity.ok(startups);
    }

    /**
     * Update startup status
     */
    @PutMapping("/startups/{id}/status")
    public ResponseEntity<?> updateStartupStatus(
            @PathVariable UUID id,
            @RequestBody StatusUpdateRequest request) {
        var updatedStartup = adminService.updateStartupStatus(id, request.getStatus());
        if (updatedStartup != null) {
            return ResponseEntity.ok(updatedStartup);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Startup not found"));
    }

    /**
     * Get all investors with admin details
     */
    @GetMapping("/investors")
    public ResponseEntity<?> getAllInvestors(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        var investors = adminService.getAllInvestors(status, search, pageable);
        return ResponseEntity.ok(investors);
    }

    /**
     * Get all investment offers
     */
    @GetMapping("/offers")
    public ResponseEntity<?> getAllOffers(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        var offers = adminService.getAllOffers(status, pageable);
        return ResponseEntity.ok(offers);
    }

    /**
     * Get activity logs
     */
    @GetMapping("/activity")
    public ResponseEntity<?> getActivityLogs(
            @RequestParam(required = false) String type,
            Pageable pageable) {
        var logs = adminService.getActivityLogs(type, pageable);
        return ResponseEntity.ok(logs);
    }

    // Request DTOs
    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
