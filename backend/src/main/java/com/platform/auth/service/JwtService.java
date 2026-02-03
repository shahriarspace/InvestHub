package com.platform.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-minutes}")
    private long jwtExpirationMinutes;

    @Value("${jwt.refresh-expiration-days}")
    private long refreshExpirationDays;

    public String generateToken(UUID userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("role", role);
        return createToken(claims, userId.toString(), jwtExpirationMinutes * 60 * 1000);
    }

    public String generateRefreshToken(UUID userId) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userId.toString(), refreshExpirationDays * 24 * 60 * 60 * 1000);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }

    public UUID extractUserId(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return UUID.fromString(claims.getSubject());
        } catch (Exception e) {
            log.error("Error extracting userId from token", e);
            return null;
        }
    }

    public String extractEmail(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return (String) claims.get("email");
        } catch (Exception e) {
            log.error("Error extracting email from token", e);
            return null;
        }
    }

    public String extractRole(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return (String) claims.get("role");
        } catch (Exception e) {
            log.error("Error extracting role from token", e);
            return null;
        }
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
