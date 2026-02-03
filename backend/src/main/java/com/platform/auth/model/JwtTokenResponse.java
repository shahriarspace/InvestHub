package com.platform.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtTokenResponse {
    private String token;
    private String refreshToken;
    private Long expiresIn;
    private String userId;
}
