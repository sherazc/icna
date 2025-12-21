package com.sc.clinic.service.security

import com.sc.clinic.dto.AuthUserTokenDto
import com.sc.clinic.dto.UserProfileUserDetails
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.JwsHeader
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class ScTokenGeneratorService {

    fun generateToken(authentication: Authentication): AuthUserTokenDto? {

        val now = Instant.now()
        val user = authentication.principal as UserProfileUserDetails

        val roles = authentication.authorities
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

        JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS512).build(), jwt)




        return null;
    }
}