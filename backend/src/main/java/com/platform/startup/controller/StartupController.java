package com.platform.startup.controller;

import com.platform.startup.model.Startup;
import com.platform.startup.model.StartupDTO;
import com.platform.startup.model.StartupStatus;
import com.platform.startup.service.StartupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
public class StartupController {
    
    @Autowired
    private StartupService startupService;
    
    /**
     * Get startup by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getStartupById(@PathVariable UUID id) {
        var startup = startupService.getStartupById(id);
        if (startup.isPresent()) {
            return ResponseEntity.ok(startup.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Startup not found");
    }
    
    /**
     * Get all startups for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Startup>> getStartupsByUserId(@PathVariable UUID userId) {
        List<Startup> startups = startupService.getStartupsByUserId(userId);
        return ResponseEntity.ok(startups);
    }
    
    /**
     * Get all startups with pagination
     */
    @GetMapping
    public ResponseEntity<Page<Startup>> getAllStartups(Pageable pageable) {
        return ResponseEntity.ok(startupService.getAllStartups(pageable));
    }
    
    /**
     * Get startups by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Startup>> getStartupsByStatus(
            @PathVariable StartupStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(startupService.getStartupsByStatus(status, pageable));
    }
    
    /**
     * Create a new startup
     */
    @PostMapping
    public ResponseEntity<?> createStartup(@RequestBody StartupDTO startupDTO) {
        if (startupDTO.getCompanyName() == null || startupDTO.getCompanyName().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Company name is required");
        }
        if (startupDTO.getUserId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User ID is required");
        }
        Startup createdStartup = startupService.createStartup(startupDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStartup);
    }
    
    /**
     * Update existing startup
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStartup(
            @PathVariable UUID id,
            @RequestBody StartupDTO startupDTO) {
        Startup updatedStartup = startupService.updateStartup(id, startupDTO);
        if (updatedStartup != null) {
            return ResponseEntity.ok(updatedStartup);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Startup not found");
    }
    
    /**
     * Delete startup
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStartup(@PathVariable UUID id) {
        if (startupService.deleteStartup(id)) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Startup not found");
    }
}
