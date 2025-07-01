package dev.kimbank.iload.domain.auth.dto;

import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link dev.kimbank.iload.domain.auth.entity.Session}
 */
@Value
public class TokenRefreshResponse implements Serializable {
    String accessToken;
    String refreshToken;
}