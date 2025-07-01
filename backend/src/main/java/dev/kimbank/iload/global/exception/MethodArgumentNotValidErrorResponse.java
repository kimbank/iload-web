package dev.kimbank.iload.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MethodArgumentNotValidErrorResponse {
    private final String code;
    private final String message;
    private final String field;
}