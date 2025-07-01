package dev.kimbank.iload.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.io.Serializable;

/**
 * DTO for {@link dev.kimbank.iload.domain.auth.entity.Session}
 */
@Value
public class TokenRefreshRequest implements Serializable {
    @NotNull
    @NotEmpty
    @NotBlank
    String refreshToken;
}