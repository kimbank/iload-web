package dev.kimbank.iload.domain.auth;

import dev.kimbank.iload.domain.auth.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name="Auth", description = "인증 관련 API")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signin")
    @Operation(summary = "로그인")
    public ResponseEntity<SigninResponse> signin(@RequestBody SigninRequest request) {
        return ResponseEntity.ok(authService.signin(request));
    }

    @PostMapping("/token-refresh")
    @Operation(summary = "토큰 갱신")
    public ResponseEntity<TokenRefreshResponse> refresh(@RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/signout")
    @Operation(summary = "로그아웃")
    public ResponseEntity<Void> signout(@RequestBody SignoutRequest request) {
        authService.signout(request.getRefreshToken());
        return ResponseEntity.ok().build();
    }
}
