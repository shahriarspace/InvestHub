package com.platform.user.model;

public enum UserRole {
    ADMIN("ROLE_ADMIN"),
    STARTUP("ROLE_STARTUP"),
    INVESTOR("ROLE_INVESTOR");

    private final String authority;

    UserRole(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }
}
