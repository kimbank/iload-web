package dev.kimbank.iload.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SecurityErrorResponse {
    private final String error;
    private final String message;
}
