package dev.kimbank.iload.global.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Getter
@Component
public class JwtProvider {
    private final Key accessKey;
    private final Key refreshKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;

    public JwtProvider(
            @Value("${spring.security.jwt.access-token.secret-key}") String accessSecretKey,
            @Value("${spring.security.jwt.refresh-token.secret-key}") String refreshSecretKey,
            @Value("${spring.security.jwt.access-token.expiration}") Long accessTokenExpiration,
            @Value("${spring.security.jwt.refresh-token.expiration}") Long refreshTokenExpiration) {
        this.accessKey = Keys.hmacShaKeyFor(accessSecretKey.getBytes());
        this.refreshKey = Keys.hmacShaKeyFor(refreshSecretKey.getBytes());
        this.accessTokenExpiration = accessTokenExpiration;
        this.refreshTokenExpiration = refreshTokenExpiration;
    }

    public String generateAccessToken(Long userId) {
        return generateToken(userId, accessKey, accessTokenExpiration);
    }

    public String generateRefreshToken(Long userId) {
        return generateToken(userId, refreshKey, refreshTokenExpiration);
    }

    private String generateToken(Long userId, Key key, long expiration) {
        return Jwts.builder()
                .setSubject(userId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token, boolean isAccessToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(isAccessToken ? accessKey : refreshKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new ExpiredJwtException(null, null, "Token has expired");
        } catch (MalformedJwtException | SignatureException e) {
            throw new MalformedJwtException("Invalid token");
        } catch (Exception e) {
            throw new RuntimeException("Token validation failed", e);
        }
    }

    public Long getUserIdFromToken(String token, boolean isAccessToken) {
        Claims claims = validateToken(token, isAccessToken);
        return Long.valueOf(claims.getSubject());
    }
}

