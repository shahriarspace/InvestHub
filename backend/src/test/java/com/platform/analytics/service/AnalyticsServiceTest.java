package com.platform.analytics.service;

import com.platform.analytics.model.AnalyticsDTO.*;
import com.platform.investment.model.InvestmentOffer;
import com.platform.investment.model.OfferStatus;
import com.platform.investment.repository.InvestmentOfferRepository;
import com.platform.investor.model.Investor;
import com.platform.investor.model.InvestorStatus;
import com.platform.investor.repository.InvestorRepository;
import com.platform.startup.model.Startup;
import com.platform.startup.model.StartupStatus;
import com.platform.startup.repository.StartupRepository;
import com.platform.user.model.User;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import com.platform.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AnalyticsServiceTest {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private InvestorRepository investorRepository;

    @Autowired
    private InvestmentOfferRepository investmentOfferRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        investmentOfferRepository.deleteAll();
        investorRepository.deleteAll();
        startupRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void getPlatformStats_ShouldReturnCorrectStats() {
        // Create test data
        createTestStartup("Startup 1", "Seed", new BigDecimal("100000"));
        createTestStartup("Startup 2", "Series A", new BigDecimal("200000"));
        createTestInvestor();

        PlatformStats stats = analyticsService.getPlatformStats();

        assertNotNull(stats);
        assertEquals(2, stats.getTotalStartups());
        assertEquals(1, stats.getTotalInvestors());
        assertEquals(new BigDecimal("300000"), stats.getTotalFundingRaised());
    }

    @Test
    void getStageDistribution_ShouldGroupByStage() {
        createTestStartup("Seed 1", "Seed", new BigDecimal("100000"));
        createTestStartup("Seed 2", "Seed", new BigDecimal("150000"));
        createTestStartup("Series A 1", "Series A", new BigDecimal("500000"));

        List<StageDistribution> distribution = analyticsService.getStageDistribution();

        assertNotNull(distribution);
        assertFalse(distribution.isEmpty());
        
        StageDistribution seedDist = distribution.stream()
            .filter(d -> "Seed".equals(d.getStage()))
            .findFirst()
            .orElse(null);
        
        assertNotNull(seedDist);
        assertEquals(2, seedDist.getStartupCount());
    }

    @Test
    void getTopStartups_ShouldReturnOrderedByFunding() {
        createTestStartup("Low Funding", "Seed", new BigDecimal("50000"));
        createTestStartup("High Funding", "Series A", new BigDecimal("500000"));
        createTestStartup("Medium Funding", "Seed", new BigDecimal("200000"));

        List<TopStartup> topStartups = analyticsService.getTopStartups(10);

        assertNotNull(topStartups);
        assertEquals(3, topStartups.size());
        assertEquals("High Funding", topStartups.get(0).getCompanyName());
    }

    @Test
    void getInvestmentTrends_ShouldReturnMonthlyTrends() {
        List<InvestmentTrend> trends = analyticsService.getInvestmentTrends(6);

        assertNotNull(trends);
        assertEquals(6, trends.size());
    }

    private Startup createTestStartup(String name, String stage, BigDecimal funding) {
        User user = User.builder()
            .email(UUID.randomUUID() + "@test.com")
            .firstName("Test")
            .lastName("User")
            .googleId(UUID.randomUUID().toString())
            .userRole(UserRole.STARTUP)
            .status(UserStatus.ACTIVE)
            .build();
        user = userRepository.save(user);

        Startup startup = new Startup();
        startup.setCompanyName(name);
        startup.setDescription("Test startup");
        startup.setStage(stage);
        startup.setUserId(user.getId());
        startup.setFundingGoal(new BigDecimal("1000000"));
        startup.setCurrentFunding(funding);
        startup.setStatus(StartupStatus.PUBLISHED);
        return startupRepository.save(startup);
    }

    private Investor createTestInvestor() {
        User user = User.builder()
            .email(UUID.randomUUID() + "@investor.com")
            .firstName("Test")
            .lastName("Investor")
            .googleId(UUID.randomUUID().toString())
            .userRole(UserRole.INVESTOR)
            .status(UserStatus.ACTIVE)
            .build();
        user = userRepository.save(user);

        Investor investor = new Investor();
        investor.setUserId(user.getId());
        investor.setInvestmentBudget(new BigDecimal("5000000"));
        investor.setInvestmentStage("Seed, Series A");
        investor.setSectorsInterested("Technology, Healthcare");
        investor.setMinTicketSize(new BigDecimal("50000"));
        investor.setMaxTicketSize(new BigDecimal("500000"));
        investor.setStatus(InvestorStatus.ACTIVE);
        return investorRepository.save(investor);
    }
}
