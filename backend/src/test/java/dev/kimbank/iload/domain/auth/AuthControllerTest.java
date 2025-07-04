package dev.kimbank.iload.domain.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.kimbank.iload.domain.auth.dto.SigninRequest;
import dev.kimbank.iload.domain.auth.dto.TokenRefreshRequest;
import dev.kimbank.iload.domain.auth.entity.Session;
import dev.kimbank.iload.domain.users.UsersRepository;
import dev.kimbank.iload.domain.users.entity.Users;
import dev.kimbank.iload.global.security.jwt.JwtProvider;
import dev.kimbank.iload.global.security.SecurityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UsersRepository userRepository;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtProvider jwtProvider;
    @Autowired
    private SecurityUtil securityUtil;

    private Users user;

    @BeforeEach
    void setUp() {
        sessionRepository.deleteAll();
        userRepository.deleteAll();

        user = new Users();
        user.setUsername("testuser");
        user.setPassword(passwordEncoder.encode("password"));
        userRepository.save(user);
    }

    @Test
    void signin_success() throws Exception {
        SigninRequest request = new SigninRequest("testuser", "password");
        mockMvc.perform(post("/api/auth/signin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    void refresh_success() throws Exception {
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());
        String hashedRefreshToken = securityUtil.hashToken(refreshToken);
        Session session = new Session();
        session.setUser(user);
        session.setRefreshToken(hashedRefreshToken);
        session.setExpiryDate(LocalDateTime.now().plusDays(7));
        session.setRevoked(false);
        sessionRepository.save(session);
        sessionRepository.flush(); // 트랜잭션 즉시 반영

        TokenRefreshRequest request = new TokenRefreshRequest(refreshToken);
        mockMvc.perform(post("/api/auth/token-refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    void hashToken_consistency() {
        String token = "testToken";
        String hash1 = securityUtil.hashToken(token);
        String hash2 = securityUtil.hashToken(token);
        assertEquals(hash1, hash2, "Hash values should be consistent");
    }

    @Test
    void validateRefreshToken() {
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());
        Long userId = jwtProvider.getUserIdFromToken(refreshToken, false);
        assertEquals(user.getId(), userId, "Token should contain correct user ID");
    }
}