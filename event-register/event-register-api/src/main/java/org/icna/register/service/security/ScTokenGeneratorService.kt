package org.icna.register.service.security

import org.icna.register.dto.AuthUserTokenDto
import org.icna.register.dto.UserProfileUserDetails
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.JwsHeader
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit

@Service
class ScTokenGeneratorService(private val encoder: JwtEncoder) {

    fun generateToken(authentication: Authentication): AuthUserTokenDto {
        val now = Instant.now()
        val user: UserProfileUserDetails = authentication.principal as UserProfileUserDetails

        val roles = authentication.authorities.stream()
            .map { simpleGrantedAuthority -> simpleGrantedAuthority.authority }
            // .filter { requestedScopes.contains(it) } // only set "role/scope/authority" that the client requested for.
            .toList()

        val expiresAt = now.plus(1, ChronoUnit.HOURS)

        val jwt = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(expiresAt)
            .subject(authentication.name)
            .claim("roles", roles)
            .claim("eventId", user.getEventId())
            .build()

        val encoderParameters = JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS512).build(), jwt)

        val tokenValue = this.encoder.encode(encoderParameters).tokenValue

        return AuthUserTokenDto(authentication.name, LocalDateTime.ofInstant(expiresAt, ZoneId.of("UTC")), roles, tokenValue)
    }
}