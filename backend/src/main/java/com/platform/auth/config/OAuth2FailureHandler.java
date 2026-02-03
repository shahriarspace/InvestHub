package com.platform.auth.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@Slf4j
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                       AuthenticationException exception) throws IOException, ServletException {
        log.error("OAuth2 authentication failed", exception);
        String redirectUrl = "http://localhost:3000/auth/error?message=" + exception.getMessage();
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
