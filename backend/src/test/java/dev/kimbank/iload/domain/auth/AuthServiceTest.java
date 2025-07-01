package dev.kimbank.iload.domain.auth;

import dev.kimbank.iload.domain.auth.dto.SigninRequest;
import dev.kimbank.iload.domain.auth.dto.SigninResponse;
import dev.kimbank.iload.domain.auth.dto.TokenRefreshRequest;
import dev.kimbank.iload.domain.auth.dto.TokenRefreshResponse;
import dev.kimbank.iload.domain.auth.entity.Session;
import dev.kimbank.iload.domain.users.UsersRepository;
import dev.kimbank.iload.domain.users.entity.Users;
import dev.kimbank.iload.global.jwt.JwtProvider;
import dev.kimbank.iload.global.jwt.SecurityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private JwtProvider jwtProvider;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private SecurityUtil securityUtil;
    @InjectMocks
    private AuthService authService;

    private Users user;
    private Session session;

    @BeforeEach
    void setUp() {
        user = new Users();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("encodedPassword");

        session = new Session();
        session.setId(1L);
        session.setUser(user);
        session.setRefreshToken("hashedRefreshToken");
        session.setExpiryDate(LocalDateTime.now().plusDays(7));
        session.setRevoked(false);
    }

    @Test
    void signin_success() {
        // Given
        SigninRequest request = new SigninRequest("testuser", "password");
        when(usersRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(jwtProvider.generateAccessToken(1L)).thenReturn("accessToken");
        when(jwtProvider.generateRefreshToken(1L)).thenReturn("refreshToken");
        when(securityUtil.hashToken("refreshToken")).thenReturn("hashedRefreshToken");
        when(jwtProvider.getRefreshTokenExpiration()).thenReturn(604800000L);
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // When
        SigninResponse response = authService.signin(request);

        // Then
        assertNotNull(response);
        assertEquals("accessToken", response.getAccessToken());
        assertEquals("refreshToken", response.getRefreshToken());
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void signin_userNotFound_throwsException() {
        // Given
        SigninRequest request = new SigninRequest("testuser", "password");
        when(usersRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> authService.signin(request));
    }

    @Test
    void refresh_success() {
        // Given
        TokenRefreshRequest request = new TokenRefreshRequest("refreshToken");
        when(securityUtil.hashToken("refreshToken")).thenReturn("hashedRefreshToken");
        when(sessionRepository.findByRefreshToken("hashedRefreshToken")).thenReturn(Optional.of(session));
        when(jwtProvider.getUserIdFromToken("refreshToken", false)).thenReturn(1L);
        when(jwtProvider.generateAccessToken(1L)).thenReturn("newAccessToken");
        when(jwtProvider.generateRefreshToken(1L)).thenReturn("newRefreshToken");
        when(securityUtil.hashToken("newRefreshToken")).thenReturn("newHashedRefreshToken");
        when(jwtProvider.getRefreshTokenExpiration()).thenReturn(604800000L);
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // When
        TokenRefreshResponse response = authService.refresh(request);

        // Then
        assertNotNull(response);
        assertEquals("newAccessToken", response.getAccessToken());
        assertEquals("newRefreshToken", response.getRefreshToken());
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void refresh_expiredToken_throwsException() {
        // Given
        session.setExpiryDate(LocalDateTime.now().minusDays(1));
        TokenRefreshRequest request = new TokenRefreshRequest("refreshToken");
        when(securityUtil.hashToken("refreshToken")).thenReturn("hashedRefreshToken");
        when(sessionRepository.findByRefreshToken("hashedRefreshToken")).thenReturn(Optional.of(session));

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> authService.refresh(request));
        verify(sessionRepository).delete(session);
    }

    @Test
    void signout_success() {
        // Given
        String refreshToken = "refreshToken";
        when(securityUtil.hashToken(refreshToken)).thenReturn("hashedRefreshToken");
        when(sessionRepository.findByRefreshToken("hashedRefreshToken")).thenReturn(Optional.of(session));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // When
        authService.signout(refreshToken);

        // Then
        verify(sessionRepository).save(any(Session.class));
        assertTrue(session.isRevoked());
    }
}