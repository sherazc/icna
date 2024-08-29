package org.icna.register.dto

import java.time.LocalDateTime

data class AuthUserTokenDto(
    val subject: String,
    val expiresAtUtc: LocalDateTime,
    val roles: List<String>,
    val token: String
)
