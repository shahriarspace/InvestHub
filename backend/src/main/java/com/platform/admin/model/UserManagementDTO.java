package com.platform.admin.model;

import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class UserManagementDTO {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePictureUrl;
    private UserRole userRole;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    private String startupName;
    private String investorCompany;
    private int totalOffersMade;
    private int totalOffersReceived;

    // Constructors
    public UserManagementDTO() {}

    // Getters
    public UUID getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public UserRole getUserRole() { return userRole; }
    public UserStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public String getStartupName() { return startupName; }
    public String getInvestorCompany() { return investorCompany; }
    public int getTotalOffersMade() { return totalOffersMade; }
    public int getTotalOffersReceived() { return totalOffersReceived; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public void setUserRole(UserRole userRole) { this.userRole = userRole; }
    public void setStatus(UserStatus status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    public void setStartupName(String startupName) { this.startupName = startupName; }
    public void setInvestorCompany(String investorCompany) { this.investorCompany = investorCompany; }
    public void setTotalOffersMade(int totalOffersMade) { this.totalOffersMade = totalOffersMade; }
    public void setTotalOffersReceived(int totalOffersReceived) { this.totalOffersReceived = totalOffersReceived; }
}
