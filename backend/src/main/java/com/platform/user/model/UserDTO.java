package com.platform.user.model;

import java.util.UUID;

public class UserDTO {
    private UUID id;
    private String googleId;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private UserRole userRole;
    private UserStatus status;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(String googleId, String email, String firstName, String lastName,
                   String profilePictureUrl, UserRole userRole, UserStatus status) {
        this.googleId = googleId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profilePictureUrl = profilePictureUrl;
        this.userRole = userRole;
        this.status = status;
    }
    
    // Getters
    public UUID getId() { return id; }
    public String getGoogleId() { return googleId; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public UserRole getUserRole() { return userRole; }
    public UserStatus getStatus() { return status; }
    
    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setGoogleId(String googleId) { this.googleId = googleId; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public void setUserRole(UserRole userRole) { this.userRole = userRole; }
    public void setStatus(UserStatus status) { this.status = status; }
}
