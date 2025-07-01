package dev.kimbank.iload.domain.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class UserSignupRequest implements Serializable {
    @NotBlank
    @NotEmpty
    @NotNull
    String username;

    @NotBlank
    @NotEmpty
    @NotNull
    String password;
}
