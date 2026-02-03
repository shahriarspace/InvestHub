package com.platform.startup.service;

import com.platform.startup.model.Startup;
import com.platform.startup.model.StartupDTO;
import com.platform.startup.model.StartupStatus;
import com.platform.startup.repository.StartupRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class StartupServiceTest {

    @Autowired
    private StartupService startupService;

    @Autowired
    private StartupRepository startupRepository;

    private Startup testStartup;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        startupRepository.deleteAll();

        testUserId = UUID.randomUUID();
        
        testStartup = new Startup();
        testStartup.setUserId(testUserId);
        testStartup.setCompanyName("Test Startup");
        testStartup.setDescription("A test startup description");
        testStartup.setStage("Seed");
        testStartup.setFundingGoal(new BigDecimal("500000"));
        testStartup.setCurrentFunding(new BigDecimal("100000"));
        testStartup.setWebsite("https://teststartup.com");
        testStartup.setStatus(StartupStatus.PUBLISHED);
        testStartup = startupRepository.save(testStartup);
    }

    @Test
    void getStartupById_WithExistingId_ReturnsStartup() {
        Optional<Startup> result = startupService.getStartupById(testStartup.getId());

        assertTrue(result.isPresent());
        assertEquals("Test Startup", result.get().getCompanyName());
        assertEquals(testUserId, result.get().getUserId());
    }

    @Test
    void getStartupById_WithNonExistingId_ReturnsEmpty() {
        Optional<Startup> result = startupService.getStartupById(UUID.randomUUID());

        assertFalse(result.isPresent());
    }

    @Test
    void getStartupsByUserId_WithExistingUserId_ReturnsStartups() {
        // Create another startup for the same user
        Startup anotherStartup = new Startup();
        anotherStartup.setUserId(testUserId);
        anotherStartup.setCompanyName("Another Startup");
        anotherStartup.setDescription("Another description");
        anotherStartup.setStatus(StartupStatus.DRAFT);
        startupRepository.save(anotherStartup);

        List<Startup> result = startupService.getStartupsByUserId(testUserId);

        assertEquals(2, result.size());
    }

    @Test
    void getStartupsByUserId_WithNonExistingUserId_ReturnsEmptyList() {
        List<Startup> result = startupService.getStartupsByUserId(UUID.randomUUID());

        assertTrue(result.isEmpty());
    }

    @Test
    void getStartupByIdAndUserId_WithMatchingIds_ReturnsStartup() {
        Optional<Startup> result = startupService.getStartupByIdAndUserId(testStartup.getId(), testUserId);

        assertTrue(result.isPresent());
        assertEquals("Test Startup", result.get().getCompanyName());
    }

    @Test
    void getStartupByIdAndUserId_WithNonMatchingUserId_ReturnsEmpty() {
        Optional<Startup> result = startupService.getStartupByIdAndUserId(testStartup.getId(), UUID.randomUUID());

        assertFalse(result.isPresent());
    }

    @Test
    void createStartup_WithValidData_CreatesAndReturnsStartup() {
        UUID newUserId = UUID.randomUUID();
        
        StartupDTO startupDTO = new StartupDTO();
        startupDTO.setUserId(newUserId);
        startupDTO.setCompanyName("New Startup");
        startupDTO.setDescription("New startup description");
        startupDTO.setStage("Pre-seed");
        startupDTO.setFundingGoal(new BigDecimal("250000"));
        startupDTO.setWebsite("https://newstartup.com");
        startupDTO.setStatus(StartupStatus.DRAFT);

        Startup result = startupService.createStartup(startupDTO);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("New Startup", result.getCompanyName());
        assertEquals(newUserId, result.getUserId());
        assertEquals(StartupStatus.DRAFT, result.getStatus());
    }

    @Test
    void createStartup_WithoutStatus_DefaultsToDraft() {
        StartupDTO startupDTO = new StartupDTO();
        startupDTO.setUserId(UUID.randomUUID());
        startupDTO.setCompanyName("No Status Startup");
        startupDTO.setDescription("Description");

        Startup result = startupService.createStartup(startupDTO);

        assertEquals(StartupStatus.DRAFT, result.getStatus());
    }

    @Test
    void updateStartup_WithValidData_UpdatesAndReturnsStartup() {
        StartupDTO updateDTO = new StartupDTO();
        updateDTO.setCompanyName("Updated Startup Name");
        updateDTO.setDescription("Updated description");
        updateDTO.setFundingGoal(new BigDecimal("750000"));

        Startup result = startupService.updateStartup(testStartup.getId(), updateDTO);

        assertNotNull(result);
        assertEquals("Updated Startup Name", result.getCompanyName());
        assertEquals("Updated description", result.getDescription());
        assertEquals(new BigDecimal("750000"), result.getFundingGoal());
        // Original values should remain unchanged
        assertEquals("Seed", result.getStage());
        assertEquals(testUserId, result.getUserId());
    }

    @Test
    void updateStartup_WithNonExistingId_ReturnsNull() {
        StartupDTO updateDTO = new StartupDTO();
        updateDTO.setCompanyName("Updated Name");

        Startup result = startupService.updateStartup(UUID.randomUUID(), updateDTO);

        assertNull(result);
    }

    @Test
    void updateStartup_WithStatusChange_UpdatesStatus() {
        StartupDTO updateDTO = new StartupDTO();
        updateDTO.setStatus(StartupStatus.ARCHIVED);

        Startup result = startupService.updateStartup(testStartup.getId(), updateDTO);

        assertNotNull(result);
        assertEquals(StartupStatus.ARCHIVED, result.getStatus());
    }

    @Test
    void deleteStartup_WithExistingId_DeletesStartup() {
        boolean result = startupService.deleteStartup(testStartup.getId());

        assertTrue(result);
        assertFalse(startupRepository.existsById(testStartup.getId()));
    }

    @Test
    void deleteStartup_WithNonExistingId_ReturnsFalse() {
        boolean result = startupService.deleteStartup(UUID.randomUUID());

        assertFalse(result);
    }

    @Test
    void getStartupsByStatus_WithExistingStatus_ReturnsStartups() {
        // Create draft startup
        Startup draftStartup = new Startup();
        draftStartup.setUserId(UUID.randomUUID());
        draftStartup.setCompanyName("Draft Startup");
        draftStartup.setDescription("Draft description");
        draftStartup.setStatus(StartupStatus.DRAFT);
        startupRepository.save(draftStartup);

        Page<Startup> publishedStartups = startupService.getStartupsByStatus(StartupStatus.PUBLISHED, PageRequest.of(0, 10));
        Page<Startup> draftStartups = startupService.getStartupsByStatus(StartupStatus.DRAFT, PageRequest.of(0, 10));

        assertEquals(1, publishedStartups.getTotalElements());
        assertEquals(1, draftStartups.getTotalElements());
        assertEquals("Test Startup", publishedStartups.getContent().get(0).getCompanyName());
        assertEquals("Draft Startup", draftStartups.getContent().get(0).getCompanyName());
    }

    @Test
    void getAllStartups_ReturnsAllStartupsWithPagination() {
        // Create additional startups
        for (int i = 0; i < 5; i++) {
            Startup startup = new Startup();
            startup.setUserId(UUID.randomUUID());
            startup.setCompanyName("Startup " + i);
            startup.setDescription("Description " + i);
            startup.setStatus(StartupStatus.PUBLISHED);
            startupRepository.save(startup);
        }

        Page<Startup> firstPage = startupService.getAllStartups(PageRequest.of(0, 3));
        Page<Startup> secondPage = startupService.getAllStartups(PageRequest.of(1, 3));

        assertEquals(6, firstPage.getTotalElements()); // 1 original + 5 new
        assertEquals(3, firstPage.getContent().size());
        assertEquals(2, firstPage.getTotalPages());
    }

    @Test
    void createStartup_SetsCreatedAtAndUpdatedAt() {
        StartupDTO startupDTO = new StartupDTO();
        startupDTO.setUserId(UUID.randomUUID());
        startupDTO.setCompanyName("Timestamp Test Startup");
        startupDTO.setDescription("Testing timestamps");
        startupDTO.setStatus(StartupStatus.DRAFT);

        Startup result = startupService.createStartup(startupDTO);

        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
    }
}
