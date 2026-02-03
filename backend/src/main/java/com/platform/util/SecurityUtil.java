package com.platform.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.UUID;

public class SecurityUtil {
    
    public static UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UUID) {
            return (UUID) authentication.getPrincipal();
        }
        return null;
    }

    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }

    public static String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !authentication.getAuthorities().isEmpty()) {
            return authentication.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority())
                    .orElse(null);
        }
        return null;
    }
}
