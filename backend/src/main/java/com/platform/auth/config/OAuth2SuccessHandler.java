package com.platform.auth.config;

import com.platform.auth.service.JwtService;
import com.platform.user.model.User;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import com.platform.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                       Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String googleId = oauth2User.getAttribute("sub");
        String email = oauth2User.getAttribute("email");
        String firstName = oauth2User.getAttribute("given_name");
        String lastName = oauth2User.getAttribute("family_name");
        String picture = oauth2User.getAttribute("picture");

        Optional<User> existingUser = userRepository.findByGoogleId(googleId);
        
        User user;
        if (existingUser.isPresent()) {
            // User already exists, just retrieve it
            user = existingUser.get();
        } else {
            // Create new user
            user = new User();
            user.setGoogleId(googleId);
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setProfilePictureUrl(picture);
            user.setUserRole(UserRole.STARTUP);
            user.setStatus(UserStatus.PENDING_APPROVAL);
        }

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getUserRole().toString());
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        String redirectUrl = String.format("http://localhost:3000/auth/callback?token=%s&refreshToken=%s&userId=%s",
                token, refreshToken, user.getId());

        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
