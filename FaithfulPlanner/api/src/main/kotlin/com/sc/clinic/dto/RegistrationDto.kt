package com.sc.clinic.dto

import jakarta.validation.Valid

data class RegistrationDto(
    @field:Valid
    val company: CompanyDto,
    @field:Valid
    val userProfile: UserProfileDto)
