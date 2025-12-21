package com.sc.clinic.dto

import java.time.LocalDateTime

class AuthUserTokenDto(
    val userProfileId: Long,
    val companyId: Long,
    val subject: String, // user email
    val expiresAtUtc: LocalDateTime,
    val roles: List<String>,
    val token: String)