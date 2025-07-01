package dev.kimbank.iload.global.exception;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.security.SignatureException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // DTO 검증 예외 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MethodArgumentNotValidErrorResponse> handleValidationException(
            MethodArgumentNotValidException e) {

        FieldError fieldError = e.getBindingResult().getFieldErrors().get(0);

        MethodArgumentNotValidErrorResponse errorResponse = new MethodArgumentNotValidErrorResponse(
                "VALIDATION_ERROR",
                fieldError.getDefaultMessage(),
                fieldError.getField()
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    // JWT 토큰 만료 401
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<SecurityErrorResponse> handleExpiredJwtException(ExpiredJwtException ex) {
        return new ResponseEntity<>(new SecurityErrorResponse("Token expired", ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    // JWT 토큰 유효하지 않음 401
    @ExceptionHandler({MalformedJwtException.class, SignatureException.class})
    public ResponseEntity<SecurityErrorResponse> handleInvalidJwtException(Exception ex) {
        return new ResponseEntity<>(new SecurityErrorResponse("Invalid token", ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    // 기타 예외 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<SecurityErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(new SecurityErrorResponse("Bad request", ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    // 서버 내부 오류 처리
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<SecurityErrorResponse> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(new SecurityErrorResponse("Server error", ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
