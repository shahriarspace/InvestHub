package com.platform.investment.controller;

import com.platform.investment.model.InvestmentOffer;
import com.platform.investment.model.InvestmentOfferDTO;
import com.platform.investment.model.OfferStatus;
import com.platform.investment.service.InvestmentOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/investment-offers")
public class InvestmentOfferController {
    
    @Autowired
    private InvestmentOfferService investmentOfferService;
    
    /**
     * Get offer by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOfferById(@PathVariable UUID id) {
        var offer = investmentOfferService.getOfferById(id);
        if (offer.isPresent()) {
            return ResponseEntity.ok(offer.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investment offer not found");
    }
    
    /**
     * Get all offers for an idea
     */
    @GetMapping("/idea/{ideaId}")
    public ResponseEntity<List<InvestmentOffer>> getOffersByIdeaId(@PathVariable UUID ideaId) {
        List<InvestmentOffer> offers = investmentOfferService.getOffersByIdeaId(ideaId);
        return ResponseEntity.ok(offers);
    }
    
    /**
     * Get all offers from an investor
     */
    @GetMapping("/investor/{investorId}")
    public ResponseEntity<List<InvestmentOffer>> getOffersByInvestorId(@PathVariable UUID investorId) {
        List<InvestmentOffer> offers = investmentOfferService.getOffersByInvestorId(investorId);
        return ResponseEntity.ok(offers);
    }
    
    /**
     * Get offers by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<InvestmentOffer>> getOffersByStatus(
            @PathVariable OfferStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(investmentOfferService.getOffersByStatus(status, pageable));
    }
    
    /**
     * Create a new investment offer
     */
    @PostMapping
    public ResponseEntity<?> createOffer(@RequestBody InvestmentOfferDTO offerDTO) {
        if (offerDTO.getInvestorId() == null || offerDTO.getIdeaId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Investor ID and Idea ID are required");
        }
        if (offerDTO.getOfferedAmount() == null || offerDTO.getEquityPercentage() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Offered amount and equity percentage are required");
        }
        InvestmentOffer createdOffer = investmentOfferService.createOffer(offerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOffer);
    }
    
    /**
     * Update existing offer
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOffer(
            @PathVariable UUID id,
            @RequestBody InvestmentOfferDTO offerDTO) {
        InvestmentOffer updatedOffer = investmentOfferService.updateOffer(id, offerDTO);
        if (updatedOffer != null) {
            return ResponseEntity.ok(updatedOffer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investment offer not found");
    }
    
    /**
     * Accept offer
     */
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptOffer(@PathVariable UUID id) {
        InvestmentOffer offer = investmentOfferService.acceptOffer(id);
        if (offer != null) {
            return ResponseEntity.ok(offer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investment offer not found");
    }
    
    /**
     * Reject offer
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectOffer(@PathVariable UUID id) {
        InvestmentOffer offer = investmentOfferService.rejectOffer(id);
        if (offer != null) {
            return ResponseEntity.ok(offer);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investment offer not found");
    }
    
    /**
     * Delete offer
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable UUID id) {
        if (investmentOfferService.deleteOffer(id)) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Investment offer not found");
    }
}
