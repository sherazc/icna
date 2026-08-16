package com.sc.clinic.dto

import jakarta.validation.constraints.NotBlank

data class RefreshTokenRequestDto(
    @field:NotBlank(message = "refreshToken is required.")
    var refreshToken: String
)
