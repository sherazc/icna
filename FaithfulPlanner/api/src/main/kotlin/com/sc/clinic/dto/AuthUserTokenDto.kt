package com.sc.clinic.dto

import java.time.LocalDateTime

class AuthUserTokenDto(
    var userProfileId: Long,
    var companyId: Long,
    var companyName: String,
    var subject: String, // user email
    var issuedAtUtc: LocalDateTime,
    var expiresAtUtc: LocalDateTime,
    var roles: List<String>,
    var token: String,
    var refreshToken: String)