package com.sc.clinic.service.security

import com.sc.clinic.dto.AuthUserTokenDto
import com.sc.clinic.dto.UserProfileUserDetails
import com.sc.clinic.entity.RefreshToken
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.exception.ScBadRequestException
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.RefreshTokenRepository
import com.sc.clinic.repository.UserProfileRepository
import com.sc.clinic.service.CompanyService
import com.sc.clinic.service.model.JwtClaim
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.JwsHeader
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit
import java.util.Base64

@Service
class ScTokenGeneratorService(
    private val encoder: JwtEncoder,
    private val companyService: CompanyService,
    private val userProfileRepository: UserProfileRepository,
    private val refreshTokenRepository: RefreshTokenRepository
) {

    companion object {
        private val secureRandom = SecureRandom()
        private const val REFRESH_TOKEN_TTL_DAYS = 14L
    }

    fun generateToken(authentication: Authentication): AuthUserTokenDto {
        val user = authentication.principal as UserProfileUserDetails
        val companyId: Long = user.getCompanyId() ?: throw ScException("Failed to generate token. Company ID is null.")
        val company = companyService.getCompany(companyId)

        val roles: List<String> = authentication.authorities
            .mapNotNull { it.authority }
            .filter { it != "FACTOR_PASSWORD" } // Removing MFA role. Introduced in spring security 7

        val userProfile = userProfileRepository.getReferenceById(user.getUserProfileId())

        return buildAuthUserToken(
            userProfile = userProfile,
            companyId = companyId,
            companyName = company.companyName,
            subject = authentication.name,
            roles = roles
        )
    }

    @Transactional
    fun refreshToken(refreshTokenValue: String): AuthUserTokenDto {
        val tokenHash = hashToken(refreshTokenValue)
        val existing = refreshTokenRepository.findByTokenHash(tokenHash)
            ?: throw ScBadRequestException("refreshToken", "Invalid refresh token.")

        if (existing.revokedAt != null) {
            throw ScBadRequestException("refreshToken", "Refresh token has been revoked.")
        }
        if (existing.expiresAt.isBefore(LocalDateTime.now())) {
            throw ScBadRequestException("refreshToken", "Refresh token has expired.")
        }

        existing.revokedAt = LocalDateTime.now()
        refreshTokenRepository.save(existing)

        val userProfile = existing.userProfile
        val company = companyService.getCompany(userProfile.company.id)
        val roles = userProfile.userRoles?.map { it.roleName } ?: emptyList()

        return buildAuthUserToken(
            userProfile = userProfile,
            companyId = company.id!!,
            companyName = company.companyName,
            subject = userProfile.email,
            roles = roles
        )
    }

    private fun buildAuthUserToken(
        userProfile: UserProfile,
        companyId: Long,
        companyName: String,
        subject: String,
        roles: List<String>
    ): AuthUserTokenDto {
        val now = Instant.now()
        val expiresAt = now.plus(1, ChronoUnit.HOURS)
        val userProfileId = userProfile.id!!

        val jwt = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(expiresAt)
            .subject(subject)
            .claim(JwtClaim.roles.value, roles)
            .claim(JwtClaim.companyId.value, companyId)
            .claim(JwtClaim.userProfileId.value, userProfileId)
            .build()

        val encoderParameters = JwtEncoderParameters.from(
            JwsHeader.with(MacAlgorithm.HS512).build(), jwt
        )

        val tokenValue = this.encoder.encode(encoderParameters).tokenValue
        val refreshTokenValue = issueRefreshToken(userProfile)

        return AuthUserTokenDto(
            userProfileId,
            companyId,
            companyName,
            subject,
            LocalDateTime.ofInstant(now, ZoneId.of("UTC")),
            LocalDateTime.ofInstant(expiresAt, ZoneId.of("UTC")),
            roles,
            tokenValue,
            refreshTokenValue
        )
    }

    private fun issueRefreshToken(userProfile: UserProfile): String {
        val randomBytes = ByteArray(32)
        secureRandom.nextBytes(randomBytes)
        val rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes)

        refreshTokenRepository.save(
            RefreshToken(
                userProfile = userProfile,
                tokenHash = hashToken(rawToken),
                expiresAt = LocalDateTime.now().plusDays(REFRESH_TOKEN_TTL_DAYS)
            )
        )

        return rawToken
    }

    private fun hashToken(token: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(token.toByteArray())
        return Base64.getEncoder().encodeToString(digest)
    }
}