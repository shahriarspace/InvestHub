package com.platform.investor.controller;

import com.platform.investor.model.Investor;
import com.platform.investor.model.InvestorDTO;
import com.platform.investor.model.InvestorStatus;
import com.platform.investor.service.InvestorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/investors")
public class InvestorController {
    
    @Autowired
    private InvestorService investorService;
    
    /**
     * Get investor by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getInvestorById(@PathVariable UUID id) {
        var investor = investorService.getInvestorById(id);
        if (investor.isPresent()) {
            return ResponseEntity.ok(investor.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investor not found");
    }
    
    /**
     * Get investor by user ID
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getInvestorByUserId(@PathVariable UUID userId) {
        var investor = investorService.getInvestorByUserId(userId);
        if (investor.isPresent()) {
            return ResponseEntity.ok(investor.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investor profile not found");
    }
    
    /**
     * Get all investors with pagination
     */
    @GetMapping
    public ResponseEntity<Page<Investor>> getAllInvestors(Pageable pageable) {
        return ResponseEntity.ok(investorService.getAllInvestors(pageable));
    }
    
    /**
     * Get investors by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Investor>> getInvestorsByStatus(
            @PathVariable InvestorStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(investorService.getInvestorsByStatus(status, pageable));
    }
    
    /**
     * Create a new investor profile
     */
    @PostMapping
    public ResponseEntity<?> createInvestor(@RequestBody InvestorDTO investorDTO) {
        if (investorDTO.getUserId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("User ID is required");
        }
        Investor createdInvestor = investorService.createInvestor(investorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInvestor);
    }
    
    /**
     * Update existing investor
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvestor(
            @PathVariable UUID id,
            @RequestBody InvestorDTO investorDTO) {
        Investor updatedInvestor = investorService.updateInvestor(id, investorDTO);
        if (updatedInvestor != null) {
            return ResponseEntity.ok(updatedInvestor);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investor not found");
    }
    
    /**
     * Delete investor
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvestor(@PathVariable UUID id) {
        if (investorService.deleteInvestor(id)) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investor not found");
    }
}
