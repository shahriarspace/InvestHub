package com.platform.user.service;

import com.platform.user.model.User;
import com.platform.user.model.UserDTO;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import com.platform.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get user by ID
     */
    public Optional<User> getUserById(UUID id) {
        return userRepository.findById(id);
    }
    
    /**
     * Get user by email
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Get user by Google ID
     */
    public Optional<User> getUserByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }
    
    /**
     * Create a new user
     */
    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setGoogleId(userDTO.getGoogleId());
        user.setEmail(userDTO.getEmail());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setProfilePictureUrl(userDTO.getProfilePictureUrl());
        user.setUserRole(userDTO.getUserRole());
        user.setStatus(userDTO.getStatus());
        
        return userRepository.save(user);
    }
    
    /**
     * Update existing user
     */
    public User updateUser(UUID id, UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (userDTO.getEmail() != null) {
                user.setEmail(userDTO.getEmail());
            }
            if (userDTO.getFirstName() != null) {
                user.setFirstName(userDTO.getFirstName());
            }
            if (userDTO.getLastName() != null) {
                user.setLastName(userDTO.getLastName());
            }
            if (userDTO.getProfilePictureUrl() != null) {
                user.setProfilePictureUrl(userDTO.getProfilePictureUrl());
            }
            if (userDTO.getUserRole() != null) {
                user.setUserRole(userDTO.getUserRole());
            }
            if (userDTO.getStatus() != null) {
                user.setStatus(userDTO.getStatus());
            }
            return userRepository.save(user);
        }
        return null;
    }
    
    /**
     * Delete user (soft delete by setting status to DELETED)
     */
    public boolean deleteUser(UUID id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User u = user.get();
            u.setStatus(UserStatus.DELETED);
            userRepository.save(u);
            return true;
        }
        return false;
    }
    
    /**
     * Get all users by role
     */
    public Page<User> getUsersByRole(UserRole role, Pageable pageable) {
        return userRepository.findByUserRole(role, pageable);
    }
    
    /**
     * Get all users by status
     */
    public Page<User> getUsersByStatus(UserStatus status, Pageable pageable) {
        return userRepository.findByStatus(status, pageable);
    }
    
    /**
     * Get all users with pagination
     */
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    /**
     * Check if user exists by email
     */
    public boolean userExistsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }
    
    /**
     * Check if user exists by Google ID
     */
    public boolean userExistsByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId).isPresent();
    }
}
