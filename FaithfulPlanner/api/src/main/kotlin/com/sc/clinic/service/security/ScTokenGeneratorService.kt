package com.sc.clinic.service.security

import com.sc.clinic.dto.AuthUserTokenDto
import com.sc.clinic.dto.UserProfileUserDetails
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
        val user = authentication.principal as UserProfileUserDetails

        val roles = authentication.authorities.stream()
            .map { simpleGrantedAuthority ->  simpleGrantedAuthority.authority }
            .toList()

        val expiresAt = now.plus(1, ChronoUnit.HOURS)

        val jwt = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(expiresAt)
            .subject(authentication.name)
            .claim("roles", roles)
            .claim("companyId", user.getCompanyId())
            .build()

        val encoderParameters = JwtEncoderParameters.from(
            JwsHeader.with(MacAlgorithm.HS512).build(), jwt)

        val tokenValue = this.encoder.encode(encoderParameters).tokenValue
        val companyId: Long = 100 // userProfileService.getCompanyIdByUserProfileId(user.getUserProfileId())

        return AuthUserTokenDto(
            user.getUserProfileId(),
            companyId,
            authentication.name,
            LocalDateTime.ofInstant(now, ZoneId.of("UTC")),
            roles,
            tokenValue
        );
    }
}