package org.example.pantryplanner.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private SecretKey getSignInKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {
        JwtBuilder builder = Jwts.builder();
        builder.subject(userDetails.getUsername());
        builder.issuedAt(new Date(System.currentTimeMillis()));
        builder.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24));
        return builder.signWith(getSignInKey()).compact();
    }

    public String getUsername(String token) {
        Jws<Claims> claims = Jwts.parser().verifyWith(getSignInKey()).build().parseSignedClaims(token);
        return claims.getPayload().getSubject();
    }

    public Date getExpiration(String token) {
        Jws<Claims> claims = Jwts.parser().verifyWith(getSignInKey()).build().parseSignedClaims(token);
        return claims.getPayload().getExpiration();
    }

    public boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsername(token);
        return userDetails.getUsername().equals(username) && !isTokenExpired(token);
    }


}
