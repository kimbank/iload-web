package dev.kimbank.iload.domain.users.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UsernameCheckResponse {
    private boolean available;
    private String message;
}
