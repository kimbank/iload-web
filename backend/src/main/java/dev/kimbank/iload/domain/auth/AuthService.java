package dev.kimbank.iload.domain.auth;

import dev.kimbank.iload.domain.auth.dto.SigninRequest;
import dev.kimbank.iload.domain.auth.dto.SigninResponse;
import dev.kimbank.iload.domain.auth.dto.TokenRefreshRequest;
import dev.kimbank.iload.domain.auth.dto.TokenRefreshResponse;
import dev.kimbank.iload.domain.auth.entity.Session;
import dev.kimbank.iload.domain.users.UsersRepository;
import dev.kimbank.iload.domain.users.entity.Users;
import dev.kimbank.iload.global.security.jwt.JwtProvider;
import dev.kimbank.iload.global.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final SessionRepository sessionRepository;
    private final UsersRepository usersRepository;
    private final SecurityUtil securityUtil;

    @Transactional
    public SigninResponse signin(SigninRequest request) {
        Users user = usersRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String accessToken = jwtProvider.generateAccessToken(user.getId());
        String refreshToken = jwtProvider.generateRefreshToken(user.getId());
        String hashedRefreshToken = securityUtil.hashToken(refreshToken);

        Session session = new Session();
        session.setUser(user);
        session.setRefreshToken(hashedRefreshToken);
        session.setExpiryDate(Instant.now().plusSeconds(jwtProvider.getRefreshTokenExpiration() / 1000));
        session.setRevoked(false);
        sessionRepository.save(session);

        return new SigninResponse(accessToken, refreshToken, user.getUsername());
    }

    @Transactional
    public TokenRefreshResponse refresh(TokenRefreshRequest request) {
        String hashedRefreshToken = securityUtil.hashToken(request.getRefreshToken());
        Session session = sessionRepository.findByRefreshToken(hashedRefreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (session.isRevoked() || session.getExpiryDate().isBefore(Instant.now())) {
            sessionRepository.delete(session);
            throw new IllegalArgumentException("Refresh token is revoked or expired");
        }

        Long userId = jwtProvider.getUserIdFromToken(request.getRefreshToken(), false);
        String newAccessToken = jwtProvider.generateAccessToken(userId);
        String newRefreshToken = jwtProvider.generateRefreshToken(userId);
        String newHashedRefreshToken = securityUtil.hashToken(newRefreshToken);

        session.setRefreshToken(newHashedRefreshToken);
        session.setExpiryDate(Instant.now().plusSeconds(jwtProvider.getRefreshTokenExpiration() / 1000));
        session.setRevoked(false);
        sessionRepository.save(session);

        return new TokenRefreshResponse(newAccessToken, newRefreshToken);
    }

    @Transactional
    public void signout(String refreshToken) {
        String hashedRefreshToken = securityUtil.hashToken(refreshToken);
        sessionRepository.findByRefreshToken(hashedRefreshToken)
                .ifPresent(session -> {
                    session.setRevoked(true);
                    sessionRepository.save(session);
                });
    }
}