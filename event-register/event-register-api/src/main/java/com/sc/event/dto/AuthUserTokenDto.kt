package com.sc.event.dto

import java.time.LocalDateTime

data class AuthUserTokenDto(
    val userProfileId: Long,
    val registrationId: Long,
    val subject: String,
    val expiresAtUtc: LocalDateTime,
    val roles: List<String>,
    val token: String
)
