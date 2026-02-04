package com.platform.investor.service;

import com.platform.investor.model.Investor;
import com.platform.investor.model.InvestorDTO;
import com.platform.investor.model.InvestorStatus;
import com.platform.investor.repository.InvestorRepository;
import com.platform.user.model.User;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import com.platform.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class InvestorServiceTest {

    @Autowired
    private InvestorService investorService;

    @Autowired
    private InvestorRepository investorRepository;

    @Autowired
    private UserRepository userRepository;

    private Investor testInvestor;
    private User testUser;

    @BeforeEach
    void setUp() {
        investorRepository.deleteAll();
        userRepository.deleteAll();

        testUser = User.builder()
            .email("investor@test.com")
            .firstName("Test")
            .lastName("Investor")
            .googleId("test-investor-google-id")
            .userRole(UserRole.INVESTOR)
            .status(UserStatus.ACTIVE)
            .build();
        testUser = userRepository.save(testUser);

        testInvestor = new Investor();
        testInvestor.setUserId(testUser.getId());
        testInvestor.setInvestmentBudget(new BigDecimal("5000000"));
        testInvestor.setInvestmentStage("Seed, Series A");
        testInvestor.setSectorsInterested("Technology, AI/ML, SaaS");
        testInvestor.setMinTicketSize(new BigDecimal("50000"));
        testInvestor.setMaxTicketSize(new BigDecimal("500000"));
        testInvestor.setPortfolioCompanies("TechCorp, AI Labs");
        testInvestor.setStatus(InvestorStatus.ACTIVE);
        testInvestor = investorRepository.save(testInvestor);
    }

    @Test
    void getInvestorById_WithExistingId_ReturnsInvestor() {
        Optional<Investor> result = investorService.getInvestorById(testInvestor.getId());

        assertTrue(result.isPresent());
        assertEquals(testUser.getId(), result.get().getUserId());
        assertEquals(new BigDecimal("5000000"), result.get().getInvestmentBudget());
    }

    @Test
    void getInvestorById_WithNonExistingId_ReturnsEmpty() {
        Optional<Investor> result = investorService.getInvestorById(UUID.randomUUID());

        assertFalse(result.isPresent());
    }

    @Test
    void getInvestorByUserId_WithExistingUserId_ReturnsInvestor() {
        Optional<Investor> result = investorService.getInvestorByUserId(testUser.getId());

        assertTrue(result.isPresent());
        assertEquals(testInvestor.getId(), result.get().getId());
    }

    @Test
    void createInvestor_WithValidData_CreatesAndReturnsInvestor() {
        User newUser = User.builder()
            .email("newinvestor@test.com")
            .firstName("New")
            .lastName("Investor")
            .googleId("new-investor-google-id")
            .userRole(UserRole.INVESTOR)
            .status(UserStatus.ACTIVE)
            .build();
        newUser = userRepository.save(newUser);

        InvestorDTO investorDTO = new InvestorDTO();
        investorDTO.setUserId(newUser.getId());
        investorDTO.setInvestmentBudget(new BigDecimal("2000000"));
        investorDTO.setInvestmentStage("Pre-seed");
        investorDTO.setSectorsInterested("Healthcare");
        investorDTO.setMinTicketSize(new BigDecimal("25000"));
        investorDTO.setMaxTicketSize(new BigDecimal("250000"));
        investorDTO.setStatus(InvestorStatus.ACTIVE);

        Investor result = investorService.createInvestor(investorDTO);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals(newUser.getId(), result.getUserId());
        assertEquals(new BigDecimal("2000000"), result.getInvestmentBudget());
    }

    @Test
    void updateInvestor_WithValidData_UpdatesAndReturnsInvestor() {
        InvestorDTO updateDTO = new InvestorDTO();
        updateDTO.setInvestmentBudget(new BigDecimal("7000000"));
        updateDTO.setSectorsInterested("Technology, Healthcare, Green Tech");

        Investor result = investorService.updateInvestor(testInvestor.getId(), updateDTO);

        assertNotNull(result);
        assertEquals(new BigDecimal("7000000"), result.getInvestmentBudget());
        assertEquals("Technology, Healthcare, Green Tech", result.getSectorsInterested());
        // Original values should remain unchanged
        assertEquals("Seed, Series A", result.getInvestmentStage());
    }

    @Test
    void getAllInvestors_ReturnsAllInvestorsWithPagination() {
        // Create additional investors
        for (int i = 0; i < 5; i++) {
            User user = User.builder()
                .email("investor" + i + "@test.com")
                .firstName("Investor")
                .lastName(String.valueOf(i))
                .googleId("google-id-" + i)
                .userRole(UserRole.INVESTOR)
                .status(UserStatus.ACTIVE)
                .build();
            user = userRepository.save(user);

            Investor investor = new Investor();
            investor.setUserId(user.getId());
            investor.setInvestmentBudget(new BigDecimal("1000000"));
            investor.setStatus(InvestorStatus.ACTIVE);
            investorRepository.save(investor);
        }

        Page<Investor> firstPage = investorService.getAllInvestors(PageRequest.of(0, 3));
        Page<Investor> secondPage = investorService.getAllInvestors(PageRequest.of(1, 3));

        assertEquals(6, firstPage.getTotalElements()); // 1 original + 5 new
        assertEquals(3, firstPage.getContent().size());
        assertEquals(2, firstPage.getTotalPages());
    }

    @Test
    void deleteInvestor_WithExistingId_DeletesInvestor() {
        boolean result = investorService.deleteInvestor(testInvestor.getId());

        assertTrue(result);
        assertFalse(investorRepository.existsById(testInvestor.getId()));
    }
}
