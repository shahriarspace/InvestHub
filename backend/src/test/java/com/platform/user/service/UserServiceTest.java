package com.platform.user.service;

import com.platform.user.model.User;
import com.platform.user.model.UserDTO;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        testUser = User.builder()
                .email("testuser@example.com")
                .firstName("Test")
                .lastName("User")
                .googleId("test_google_123")
                .userRole(UserRole.STARTUP)
                .status(UserStatus.ACTIVE)
                .build();
        testUser = userRepository.save(testUser);
    }

    @Test
    void getUserById_WithExistingId_ReturnsUser() {
        Optional<User> result = userService.getUserById(testUser.getId());

        assertTrue(result.isPresent());
        assertEquals("testuser@example.com", result.get().getEmail());
        assertEquals("Test", result.get().getFirstName());
    }

    @Test
    void getUserById_WithNonExistingId_ReturnsEmpty() {
        Optional<User> result = userService.getUserById(java.util.UUID.randomUUID());

        assertFalse(result.isPresent());
    }

    @Test
    void getUserByEmail_WithExistingEmail_ReturnsUser() {
        Optional<User> result = userService.getUserByEmail("testuser@example.com");

        assertTrue(result.isPresent());
        assertEquals(testUser.getId(), result.get().getId());
    }

    @Test
    void getUserByEmail_WithNonExistingEmail_ReturnsEmpty() {
        Optional<User> result = userService.getUserByEmail("nonexistent@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    void createUser_WithValidData_CreatesAndReturnsUser() {
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail("newuser@example.com");
        userDTO.setFirstName("New");
        userDTO.setLastName("User");
        userDTO.setGoogleId("new_google_456");
        userDTO.setUserRole(UserRole.INVESTOR);
        userDTO.setStatus(UserStatus.ACTIVE);

        User result = userService.createUser(userDTO);

        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals("newuser@example.com", result.getEmail());
        assertEquals("New", result.getFirstName());
        assertEquals(UserRole.INVESTOR, result.getUserRole());
    }

    @Test
    void updateUser_WithValidData_UpdatesAndReturnsUser() {
        UserDTO updateDTO = new UserDTO();
        updateDTO.setFirstName("Updated");
        updateDTO.setLastName("Name");

        User result = userService.updateUser(testUser.getId(), updateDTO);

        assertNotNull(result);
        assertEquals("Updated", result.getFirstName());
        assertEquals("Name", result.getLastName());
        // Email should remain unchanged
        assertEquals("testuser@example.com", result.getEmail());
    }

    @Test
    void updateUser_WithNonExistingId_ReturnsNull() {
        UserDTO updateDTO = new UserDTO();
        updateDTO.setFirstName("Updated");

        User result = userService.updateUser(java.util.UUID.randomUUID(), updateDTO);

        assertNull(result);
    }

    @Test
    void deleteUser_WithExistingId_SoftDeletesUser() {
        boolean result = userService.deleteUser(testUser.getId());

        assertTrue(result);
        
        // Verify user status is DELETED
        Optional<User> deletedUser = userRepository.findById(testUser.getId());
        assertTrue(deletedUser.isPresent());
        assertEquals(UserStatus.DELETED, deletedUser.get().getStatus());
    }

    @Test
    void deleteUser_WithNonExistingId_ReturnsFalse() {
        boolean result = userService.deleteUser(java.util.UUID.randomUUID());

        assertFalse(result);
    }

    @Test
    void getUsersByRole_WithExistingRole_ReturnsUsers() {
        // Create additional users with different roles
        User investor = User.builder()
                .email("investor@example.com")
                .firstName("Investor")
                .lastName("User")
                .googleId("investor_google_789")
                .userRole(UserRole.INVESTOR)
                .status(UserStatus.ACTIVE)
                .build();
        userRepository.save(investor);

        Page<User> startups = userService.getUsersByRole(UserRole.STARTUP, PageRequest.of(0, 10));
        Page<User> investors = userService.getUsersByRole(UserRole.INVESTOR, PageRequest.of(0, 10));

        assertEquals(1, startups.getTotalElements());
        assertEquals(1, investors.getTotalElements());
        assertEquals("testuser@example.com", startups.getContent().get(0).getEmail());
        assertEquals("investor@example.com", investors.getContent().get(0).getEmail());
    }

    @Test
    void getUsersByStatus_WithActiveStatus_ReturnsActiveUsers() {
        // Create suspended user
        User suspendedUser = User.builder()
                .email("suspended@example.com")
                .firstName("Suspended")
                .lastName("User")
                .googleId("suspended_google")
                .userRole(UserRole.STARTUP)
                .status(UserStatus.SUSPENDED)
                .build();
        userRepository.save(suspendedUser);

        Page<User> activeUsers = userService.getUsersByStatus(UserStatus.ACTIVE, PageRequest.of(0, 10));
        Page<User> suspendedUsers = userService.getUsersByStatus(UserStatus.SUSPENDED, PageRequest.of(0, 10));

        assertEquals(1, activeUsers.getTotalElements());
        assertEquals(1, suspendedUsers.getTotalElements());
    }

    @Test
    void getAllUsers_ReturnsAllUsersWithPagination() {
        // Create additional users
        for (int i = 0; i < 5; i++) {
            User user = User.builder()
                    .email("user" + i + "@example.com")
                    .firstName("User" + i)
                    .lastName("Test")
                    .googleId("google_" + i)
                    .userRole(UserRole.STARTUP)
                    .status(UserStatus.ACTIVE)
                    .build();
            userRepository.save(user);
        }

        Page<User> firstPage = userService.getAllUsers(PageRequest.of(0, 3));
        Page<User> secondPage = userService.getAllUsers(PageRequest.of(1, 3));

        assertEquals(6, firstPage.getTotalElements()); // 1 original + 5 new
        assertEquals(3, firstPage.getContent().size());
        assertEquals(2, firstPage.getTotalPages());
    }

    @Test
    void userExistsByEmail_WithExistingEmail_ReturnsTrue() {
        boolean result = userService.userExistsByEmail("testuser@example.com");

        assertTrue(result);
    }

    @Test
    void userExistsByEmail_WithNonExistingEmail_ReturnsFalse() {
        boolean result = userService.userExistsByEmail("nonexistent@example.com");

        assertFalse(result);
    }

    @Test
    void userExistsByGoogleId_WithExistingGoogleId_ReturnsTrue() {
        boolean result = userService.userExistsByGoogleId("test_google_123");

        assertTrue(result);
    }

    @Test
    void userExistsByGoogleId_WithNonExistingGoogleId_ReturnsFalse() {
        boolean result = userService.userExistsByGoogleId("nonexistent_google");

        assertFalse(result);
    }
}
