package com.sc.clinic.dto

import jakarta.validation.constraints.NotBlank

class RefreshTokenRequestDto(
    @field:NotBlank(message = "refreshToken is required.")
    val refreshToken: String
)
