package com.platform.config;

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
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StartupRepository startupRepository;
    private final InvestorRepository investorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository,
                      StartupRepository startupRepository,
                      InvestorRepository investorRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.startupRepository = startupRepository;
        this.investorRepository = investorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Mock data already exists, skipping...");
            return;
        }

        System.out.println("Loading mock data with BCrypt password hashing...");

        // Hash the default password
        String hashedPassword = passwordEncoder.encode("password123");

        // Admin
        User admin = User.builder()
                .email("admin@startup.io")
                .firstName("Admin")
                .lastName("User")
                .googleId("mock_admin_001")
                .passwordHash(hashedPassword)
                .userRole(UserRole.ADMIN)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(admin);

        // Startup Owner 1
        User owner1 = User.builder()
                .email("john@techstartup.io")
                .firstName("John")
                .lastName("Founder")
                .googleId("mock_startup_001")
                .passwordHash(hashedPassword)
                .userRole(UserRole.STARTUP)
                .status(UserStatus.ACTIVE)
                .build();
        owner1 = userRepository.save(owner1);

        Startup s1 = new Startup();
        s1.setCompanyName("TechVenture AI");
        s1.setDescription("AI-powered customer service automation platform.");
        s1.setStage("Seed");
        s1.setUserId(owner1.getId());
        s1.setFundingGoal(new BigDecimal("500000"));
        s1.setCurrentFunding(new BigDecimal("125000"));
        s1.setWebsite("https://techventure.ai");
        s1.setStatus(StartupStatus.PUBLISHED);
        startupRepository.save(s1);

        // Startup Owner 2
        User owner2 = User.builder()
                .email("sarah@greentech.io")
                .firstName("Sarah")
                .lastName("Green")
                .googleId("mock_startup_002")
                .passwordHash(hashedPassword)
                .userRole(UserRole.STARTUP)
                .status(UserStatus.ACTIVE)
                .build();
        owner2 = userRepository.save(owner2);

        Startup s2 = new Startup();
        s2.setCompanyName("EcoSolutions");
        s2.setDescription("Sustainable packaging for e-commerce.");
        s2.setStage("Series A");
        s2.setUserId(owner2.getId());
        s2.setFundingGoal(new BigDecimal("750000"));
        s2.setCurrentFunding(new BigDecimal("200000"));
        s2.setWebsite("https://ecosolutions.green");
        s2.setStatus(StartupStatus.PUBLISHED);
        startupRepository.save(s2);

        // Startup Owner 3
        User owner3 = User.builder()
                .email("mike@healthapp.io")
                .firstName("Mike")
                .lastName("Health")
                .googleId("mock_startup_003")
                .passwordHash(hashedPassword)
                .userRole(UserRole.STARTUP)
                .status(UserStatus.ACTIVE)
                .build();
        owner3 = userRepository.save(owner3);

        Startup s3 = new Startup();
        s3.setCompanyName("HealthTrack Pro");
        s3.setDescription("Health monitoring app with wearable integration.");
        s3.setStage("Pre-seed");
        s3.setUserId(owner3.getId());
        s3.setFundingGoal(new BigDecimal("1000000"));
        s3.setCurrentFunding(new BigDecimal("350000"));
        s3.setWebsite("https://healthtrackpro.com");
        s3.setStatus(StartupStatus.PUBLISHED);
        startupRepository.save(s3);

        // Investor 1
        User inv1 = User.builder()
                .email("investor@venture.capital")
                .firstName("Victoria")
                .lastName("Capital")
                .googleId("mock_investor_001")
                .passwordHash(hashedPassword)
                .userRole(UserRole.INVESTOR)
                .status(UserStatus.ACTIVE)
                .build();
        inv1 = userRepository.save(inv1);

        Investor i1 = new Investor();
        i1.setUserId(inv1.getId());
        i1.setInvestmentBudget(new BigDecimal("5000000"));
        i1.setInvestmentStage("Seed, Series A");
        i1.setSectorsInterested("Technology, AI/ML, SaaS");
        i1.setMinTicketSize(new BigDecimal("50000"));
        i1.setMaxTicketSize(new BigDecimal("500000"));
        i1.setPortfolioCompanies("TechCorp, AI Labs");
        i1.setStatus(InvestorStatus.ACTIVE);
        investorRepository.save(i1);

        // Investor 2
        User inv2 = User.builder()
                .email("angel@investments.co")
                .firstName("Alex")
                .lastName("Angel")
                .googleId("mock_investor_002")
                .passwordHash(hashedPassword)
                .userRole(UserRole.INVESTOR)
                .status(UserStatus.ACTIVE)
                .build();
        inv2 = userRepository.save(inv2);

        Investor i2 = new Investor();
        i2.setUserId(inv2.getId());
        i2.setInvestmentBudget(new BigDecimal("2000000"));
        i2.setInvestmentStage("Pre-seed, Seed");
        i2.setSectorsInterested("Healthcare, Green Tech");
        i2.setMinTicketSize(new BigDecimal("25000"));
        i2.setMaxTicketSize(new BigDecimal("250000"));
        i2.setPortfolioCompanies("HealthFirst, GreenEnergy");
        i2.setStatus(InvestorStatus.ACTIVE);
        investorRepository.save(i2);

        System.out.println("============================================");
        System.out.println("MOCK DATA LOADED SUCCESSFULLY!");
        System.out.println("Passwords are now BCrypt hashed!");
        System.out.println("============================================");
        System.out.println("LOGIN CREDENTIALS (password: password123)");
        System.out.println("--------------------------------------------");
        System.out.println("Admin:    admin@startup.io");
        System.out.println("Startup:  john@techstartup.io");
        System.out.println("Startup:  sarah@greentech.io");
        System.out.println("Startup:  mike@healthapp.io");
        System.out.println("Investor: investor@venture.capital");
        System.out.println("Investor: angel@investments.co");
        System.out.println("============================================");
    }
}
