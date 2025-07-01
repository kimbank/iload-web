package dev.kimbank.iload.domain.users;

import dev.kimbank.iload.domain.users.dto.UserSignupRequest;
import dev.kimbank.iload.domain.users.dto.UserResponse;
import dev.kimbank.iload.domain.users.dto.UsernameCheckResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name="Users", description = "사용자 관련 API")
public class UsersController {
    
    private final UsersService usersService;

    /**
     * username 중복 체크 API
     * GET /api/users/check-username?username={username}
     */
    @GetMapping("/check-username")
    @Operation(summary = "username 중복 체크")
    public ResponseEntity<UsernameCheckResponse> checkUsername(@RequestParam String username) {
        UsernameCheckResponse response = usersService.checkUsernameAvailability(username);
        return ResponseEntity.ok(response);
    }

    /**
     * 회원가입 API
     * POST /api/users/signup
     */
    @PostMapping("/signup")
    @Operation(summary = "회원가입")
    public ResponseEntity<?> sginupUser(@RequestBody UserSignupRequest request) {
        UserResponse response = usersService.signupUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
